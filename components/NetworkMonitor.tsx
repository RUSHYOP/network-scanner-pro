'use client'

import { useState, useEffect, useRef } from 'react'
import { Activity, ArrowUp, ArrowDown, AlertCircle, Wifi, RefreshCw } from 'lucide-react'

interface NetworkStats {
  bytesIn: number
  bytesOut: number
  requests: number
}

interface ResourceEntry {
  name: string
  transferSize: number
  type: string
  duration: number
  timestamp: number
}

export default function NetworkMonitor() {
  const [stats, setStats] = useState<NetworkStats>({
    bytesIn: 0,
    bytesOut: 0,
    requests: 0
  })
  const [resources, setResources] = useState<ResourceEntry[]>([])
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [monitoring, setMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const baselineRef = useRef<number>(0)

  const updateNetworkInfo = () => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      setNetworkInfo({
        effectiveType: conn?.effectiveType || 'unknown',
        downlink: conn?.downlink || 0,
        rtt: conn?.rtt || 0,
        saveData: conn?.saveData || false
      })
    }
  }

  const scanResources = () => {
    // Get all resource timing entries since baseline
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    let totalBytesIn = 0
    let totalRequests = 0
    const newResources: ResourceEntry[] = []

    entries.forEach((entry) => {
      // Only count entries after our baseline
      if (entry.startTime > baselineRef.current) {
        const size = entry.transferSize || entry.encodedBodySize || 0
        totalBytesIn += size
        totalRequests++

        newResources.push({
          name: entry.name,
          transferSize: size,
          type: entry.initiatorType,
          duration: entry.duration,
          timestamp: performance.timeOrigin + entry.startTime
        })
      }
    })

    setStats({
      bytesIn: totalBytesIn,
      bytesOut: 0, // Browser API doesn't expose upload size reliably
      requests: totalRequests
    })

    // Sort by timestamp descending and take last 20
    setResources(newResources.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20))
    setLastUpdate(Date.now())
  }

  const handleMonitoring = () => {
    if (monitoring) {
      // Stop monitoring
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setMonitoring(false)
      return
    }

    // Start monitoring
    setMonitoring(true)
    
    // Clear old entries and set baseline
    performance.clearResourceTimings()
    baselineRef.current = performance.now()
    
    // Reset stats
    setStats({ bytesIn: 0, bytesOut: 0, requests: 0 })
    setResources([])
    
    updateNetworkInfo()
    
    // Poll for new resources every 500ms
    intervalRef.current = setInterval(() => {
      scanResources()
      updateNetworkInfo()
    }, 500)
  }

  // Trigger a test request
  const triggerTestRequest = async () => {
    try {
      await fetch('/api/network-monitor?test=' + Date.now())
    } catch {
      // Ignore errors
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fetch': return 'bg-blue-500/20 text-blue-400'
      case 'xmlhttprequest': return 'bg-green-500/20 text-green-400'
      case 'script': return 'bg-yellow-500/20 text-yellow-400'
      case 'css': return 'bg-purple-500/20 text-purple-400'
      case 'img': return 'bg-pink-500/20 text-pink-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Downloaded</span>
            <ArrowDown className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatBytes(stats.bytesIn)}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Requests</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.requests}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Status</span>
            <div className={`w-3 h-3 rounded-full ${monitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          </div>
          <div className="text-lg font-bold text-white">
            {monitoring ? 'Active' : 'Stopped'}
          </div>
        </div>
      </div>

      {networkInfo && monitoring && (
        <div className="bg-zinc-950 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Wifi className="w-4 h-4 text-green-400" />
            <h4 className="font-semibold text-white">Connection</h4>
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Type</span>
              <div className="text-white font-semibold uppercase">{networkInfo.effectiveType}</div>
            </div>
            <div>
              <span className="text-gray-400">Speed</span>
              <div className="text-white font-semibold">{networkInfo.downlink} Mbps</div>
            </div>
            <div>
              <span className="text-gray-400">Latency</span>
              <div className="text-white font-semibold">{networkInfo.rtt} ms</div>
            </div>
            <div>
              <span className="text-gray-400">Updated</span>
              <div className="text-white font-semibold text-xs">{lastUpdate ? formatTime(lastUpdate) : '-'}</div>
            </div>
          </div>
        </div>
      )}

      {monitoring && (
        <div className="bg-zinc-950 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Recent Resources ({resources.length})</h4>
            <button
              onClick={triggerTestRequest}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded flex items-center space-x-1 text-gray-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Test Request</span>
            </button>
          </div>
          
          {resources.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-6">
              <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse text-gray-600" />
              Waiting for network activity...<br />
              <span className="text-xs">Use Port Scan, DNS Scan, or click Test Request</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {resources.map((res, index) => (
                <div key={index} className="bg-zinc-900 rounded p-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getTypeColor(res.type)}`}>
                      {res.type}
                    </span>
                    <span className="text-green-400 font-semibold">{formatBytes(res.transferSize)}</span>
                  </div>
                  <div className="text-gray-300 mt-1 truncate text-xs" title={res.name}>
                    {res.name.split('/').pop() || res.name}
                  </div>
                  <div className="text-gray-500 mt-1 flex justify-between">
                    <span>{res.duration.toFixed(0)}ms</span>
                    <span>{formatTime(res.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button 
        onClick={handleMonitoring}
        className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
          monitoring
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-white hover:bg-gray-200 text-black'
        }`}
      >
        <Activity className="w-4 h-4" />
        <span>{monitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white">
            <p className="font-semibold mb-1">Browser Network Monitor</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Tracks all resource loading (scripts, images, API calls)</li>
              <li>Uses Performance Resource Timing API</li>
              <li>Updates every 500ms while monitoring</li>
              <li>Click &quot;Test Request&quot; or use other tools to see activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
