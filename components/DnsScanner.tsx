'use client'

import { useState } from 'react'
import { Play, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function DnsScanner() {
  const [target, setTarget] = useState('')
  const [wordlist, setWordlist] = useState('common')
  const [concurrency, setConcurrency] = useState(50)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [progress, setProgress] = useState(0)

  const handleScan = async () => {
    if (!target) return
    
    setScanning(true)
    setResults([])
    setProgress(0)

    try {
      const response = await fetch('/api/dns-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, wordlist, concurrency })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.type === 'progress') {
              setProgress(data.progress)
            } else if (data.type === 'result') {
              setResults(prev => [...prev, data.result])
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('Scan error:', error)
    } finally {
      setScanning(false)
      setProgress(100)
    }
  }

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dns-scan-${target}-${Date.now()}.json`
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* Configuration Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Target Domain <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Example: google.com, github.com, example.org
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Wordlist</label>
            <select
              value={wordlist}
              onChange={(e) => setWordlist(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="common" className="bg-gray-900 text-white">Common (100 entries)</option>
              <option value="medium" className="bg-gray-900 text-white">Medium (1,000 entries)</option>
              <option value="large" className="bg-gray-900 text-white">Large (10,000 entries)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Concurrency</label>
            <input
              type="number"
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              min="1"
              max="500"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning || !target}
          className="w-full bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {scanning ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Scanning... {progress}%</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start DNS Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {scanning && (
        <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Found {results.length} subdomains</span>
            </h4>
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 text-sm bg-zinc-900 px-3 py-1 rounded-lg hover:bg-zinc-800 transition text-white border border-zinc-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 bg-zinc-950 rounded-lg p-3">
            {results.map((result, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-white">{result.subdomain}</span>
                  <span className="text-gray-400">{result.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white">
            <p className="font-semibold mb-1">How to use DNS Enumeration:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>Enter a target domain (e.g., example.com)</li>
              <li>Choose a wordlist size based on scan depth</li>
              <li>Adjust concurrency for faster scanning (higher = faster but more aggressive)</li>
              <li>Click "Start DNS Scan" and wait for results</li>
              <li>Export results as JSON for further analysis</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
