import { NextResponse } from 'next/server'
import * as net from 'net'

function scanPort(host: string, port: number, timeout: number): Promise<{ port: number; state: string; banner?: string }> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let banner = ''

    socket.setTimeout(timeout)

    socket.on('connect', () => {
      // Try to grab banner
      socket.on('data', (data) => {
        banner = data.toString().trim()
        socket.destroy()
      })

      // Wait a bit for banner
      setTimeout(() => {
        socket.destroy()
        resolve({ port, state: 'open', banner: banner || undefined })
      }, 200)
    })

    socket.on('timeout', () => {
      socket.destroy()
      resolve({ port, state: 'filtered' })
    })

    socket.on('error', () => {
      resolve({ port, state: 'closed' })
    })

    socket.connect(port, host)
  })
}

function parsePortRange(range: string): number[] {
  const ports: number[] = []
  const parts = range.split(',')

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i++) {
        ports.push(i)
      }
    } else {
      ports.push(Number(part))
    }
  }

  return ports
}

export async function POST(request: Request) {
  const { target, portRange = '1-1000', scanType = 'tcp', timeout = 1000 } = await request.json()

  if (!target) {
    return NextResponse.json({ error: 'Target required' }, { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const ports = parsePortRange(portRange)
      let completed = 0

      // Scan ports in batches of 50 for better performance
      const batchSize = 50
      for (let i = 0; i < ports.length; i += batchSize) {
        const batch = ports.slice(i, i + batchSize)
        const promises = batch.map(async (port) => {
          const result = await scanPort(target, port, timeout)
          completed++

          if (result.state === 'open') {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: 'result', result }) + '\n'
              )
            )
          }

          const progress = Math.floor((completed / ports.length) * 100)
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
