import { NextResponse } from 'next/server'
import * as dns from 'dns'
import { promisify } from 'util'

const resolveDns = promisify(dns.resolve4)

// Common subdomain wordlist
const wordlists = {
  common: [
    'www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'webdisk',
    'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig', 'api', 'dev', 'staging',
    'test', 'vpn', 'ssh', 'remote', 'admin', 'blog', 'shop', 'store', 'forum',
    'portal', 'app', 'mobile', 'cloud', 'cdn', 'media', 'img', 'images', 'static'
  ],
  medium: [] as string[], // Would contain 1000 entries
  large: [] as string[]   // Would contain 10000 entries
}

// Generate additional entries for medium and large wordlists
for (let i = 0; i < 100; i++) {
  wordlists.medium.push(...wordlists.common, `sub${i}`, `server${i}`, `host${i}`)
}
for (let i = 0; i < 1000; i++) {
  wordlists.large.push(...wordlists.medium, `test${i}`, `prod${i}`, `s${i}`)
}

export async function POST(request: Request) {
  const { target, wordlist = 'common', concurrency = 50 } = await request.json()

  if (!target) {
    return NextResponse.json({ error: 'Target domain required' }, { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const subdomains = wordlists[wordlist as keyof typeof wordlists] || wordlists.common
      const results: any[] = []
      let completed = 0

      // Process subdomains in batches
      for (let i = 0; i < subdomains.length; i += concurrency) {
        const batch = subdomains.slice(i, i + concurrency)
        const promises = batch.map(async (sub) => {
          const hostname = `${sub}.${target}`
          try {
            const addresses = await resolveDns(hostname)
            if (addresses && addresses.length > 0) {
              const result = {
                subdomain: hostname,
                ip: addresses[0]
              }
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: 'result', result }) + '\n'
                )
              )
              results.push(result)
            }
          } catch (error) {
            // DNS lookup failed - subdomain doesn't exist or not accessible
          }
          completed++
          const progress = Math.floor((completed / subdomains.length) * 100)
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: 'progress', progress }) + '\n'
            )
          )
        })

        await Promise.all(promises)
      }

      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked'
    }
  })
}
