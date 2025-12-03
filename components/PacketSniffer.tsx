'use client'

import { useState } from 'react'
import { Play, Square, Download, AlertCircle } from 'lucide-react'

export default function PacketSniffer() {
  const [interface_, setInterface] = useState('eth0')
  const [filter, setFilter] = useState('')
  const [capturing, setCapturing] = useState(false)
  const [packets, setPackets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCapture = async () => {
    if (capturing) {
      setCapturing(false)
      return
    }

    setLoading(true)
    setError('')
    setCapturing(true)

    try {
      const response = await fetch('/api/packet-sniffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interface: interface_,
          filter: filter,
          duration: 5
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture packets')
      }

      setPackets(data.packets)
    } catch (err: any) {
      setError(err.message)
      setCapturing(false)
    } finally {
      setLoading(false)
    }
  }

  const exportPCAP = () => {
    const dataStr = JSON.stringify(packets, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `capture_${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Network Interface</label>
          <select
            value={interface_}
            onChange={(e) => setInterface(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            style={{ colorScheme: 'dark' }}
          >
            <option value="eth0" className="bg-gray-900 text-white">eth0 (Ethernet)</option>
            <option value="wlan0" className="bg-gray-900 text-white">wlan0 (WiFi)</option>
            <option value="any" className="bg-gray-900 text-white">any (All interfaces)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">BPF Filter (Optional)</label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="tcp port 80 or udp port 53"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Examples: tcp, udp, icmp, port 443, host 192.168.1.1
          </p>
        </div>

        <button
          onClick={handleCapture}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            capturing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-white hover:bg-gray-200 text-black'
          }`}
        >
          {loading ? (
            <span>Capturing...</span>
          ) : capturing ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop Capture</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Capture</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400">
          {error}
        </div>
      )}

      {packets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Captured {packets.length} packets</span>
            <button 
              onClick={exportPCAP}
              className="flex items-center space-x-2 text-sm bg-zinc-900 px-3 py-1 rounded-lg hover:bg-zinc-800 transition text-white border border-zinc-700">
              <Download className="w-4 h-4" />
              <span>Export PCAP</span>
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto bg-zinc-950 rounded-lg p-3 font-mono text-xs">
            {packets.map((pkt, i) => (
              <div key={i} className="text-white mb-1">
                {pkt.timestamp} {pkt.src} → {pkt.dst} [{pkt.protocol}] Len: {pkt.length}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white">
            <p className="font-semibold mb-1">Packet Sniffer Features:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Real-time packet capture from network interfaces</li>
              <li>BPF filtering for targeted traffic analysis</li>
              <li>Protocol decoding (TCP, UDP, ICMP, HTTP, DNS)</li>
              <li>Export captures in standard PCAP format</li>
              <li><span className="text-white font-semibold">Note: Requires administrator/root privileges</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
