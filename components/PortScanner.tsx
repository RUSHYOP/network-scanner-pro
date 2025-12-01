'use client'

import { useState } from 'react'
import { Play, Download, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function PortScanner() {
  const [target, setTarget] = useState('')
  const [portRange, setPortRange] = useState('1-1000')
  const [scanType, setScanType] = useState('tcp')
  const [timeout, setTimeout] = useState(1000)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [progress, setProgress] = useState(0)

  const handleScan = async () => {
    if (!target) return
    
    setScanning(true)
    setResults([])
    setProgress(0)

    try {
      const response = await fetch('/api/port-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, portRange, scanType, timeout })
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
    link.download = `port-scan-${target}-${Date.now()}.json`
    link.click()
  }

  const getServiceName = (port: number) => {
    const services: Record<number, string> = {
      21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
      80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 445: 'SMB',
      3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 6379: 'Redis',
      8080: 'HTTP-Proxy', 27017: 'MongoDB'
    }
    return services[port] || 'Unknown'
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Configuration Form */}
      <div className="space-y-2 md:space-y-3">
        <div>
          <label className="block text-xs md:text-sm font-medium mb-1">
            Target Host/IP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1 or example.com"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Example: 192.168.1.1, scanme.nmap.org, localhost
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Port Range</label>
            <input
              type="text"
              value={portRange}
              onChange={(e) => setPortRange(e.target.value)}
              placeholder="1-1000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Scan Type</label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="tcp" className="bg-gray-900 text-white">TCP</option>
              <option value="udp" className="bg-gray-900 text-white">UDP</option>
              <option value="syn" className="bg-gray-900 text-white">SYN</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-1">Timeout (ms)</label>
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(Number(e.target.value))}
              min="100"
              max="5000"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white text-white"
            />
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning || !target}
          className="w-full bg-white text-black px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {scanning ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Scanning... {progress}%</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Port Scan</span>
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
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-semibold flex items-center space-x-2 text-white text-sm md:text-base">
              <CheckCircle className="w-5 h-5 text-white" />
              <span>Found {results.length} open ports</span>
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
                  <div>
                    <span className="font-mono text-white">Port {result.port}</span>
                    <span className="text-gray-400 ml-2">({getServiceName(result.port)})</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.state === 'open' ? 'bg-white text-black' : 'bg-zinc-800 text-gray-400'
                  }`}>
                    {result.state}
                  </span>
                </div>
                {result.banner && (
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    {result.banner}
                  </div>
                )}
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
            <p className="font-semibold mb-1">How to use Port Scanner:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>Enter target IP or hostname</li>
              <li>Specify port range (e.g., 1-1000, 80,443,8080)</li>
              <li>Choose scan type (TCP is most reliable, SYN is stealthier)</li>
              <li>Adjust timeout based on network conditions</li>
              <li>View open ports with detected services</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
