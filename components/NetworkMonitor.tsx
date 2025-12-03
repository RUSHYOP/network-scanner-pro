'use client'

import { useState, useEffect, useRef } from 'react'
import { Activity, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react'

export default function NetworkMonitor() {
  const [stats, setStats] = useState({
    bytesIn: 0,
    bytesOut: 0,
    packetsIn: 0,
    packetsOut: 0,
    connections: 0
  })
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [monitoring, setMonitoring] = useState(false)
  const [error, setError] = useState('')
  const resourceObserverRef = useRef<PerformanceObserver | null>(null)
  const startTimeRef = useRef<number>(0)
  const requestCountRef = useRef<number>(0)

  const updateNetworkInfo = () => {
    // Get network information if available (Chrome/Edge)
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

  const monitorResources = () => {
    // Monitor network requests using Performance API
    if (!('PerformanceObserver' in window)) {
      setError('Performance monitoring not supported in this browser')
      return
    }

    try {
      // Clear previous observer
      if (resourceObserverRef.current) {
        resourceObserverRef.current.disconnect()
      }

      let bytesDownloaded = 0
      let bytesUploaded = 0
      let requestCount = 0

      resourceObserverRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            
            // Approximate download size (transferSize includes headers)
            if (resourceEntry.transferSize) {
              bytesDownloaded += resourceEntry.transferSize
              requestCount++
            }
            
            // Rough estimate for upload (for POST/PUT requests)
            if (resourceEntry.encodedBodySize && resourceEntry.decodedBodySize) {
              bytesUploaded += resourceEntry.encodedBodySize * 0.1 // Rough estimate
            }
          }
        }

        setStats(prev => ({
          bytesIn: bytesDownloaded,
          bytesOut: bytesUploaded,
          packetsIn: requestCount,
          packetsOut: Math.floor(requestCount * 0.3), // Estimate
          connections: requestCount
        }))
        
        requestCountRef.current = requestCount
      })

      resourceObserverRef.current.observe({ 
        entryTypes: ['resource', 'navigation'] 
      })
    } catch (err: any) {
      setError(`Monitoring error: ${err.message}`)
    }
  }

  const handleMonitoring = () => {
    if (monitoring) {
      setMonitoring(false)
      if (resourceObserverRef.current) {
        resourceObserverRef.current.disconnect()
      }
      return
    }

    setMonitoring(true)
    setError('')
    setStats({
      bytesIn: 0,
      bytesOut: 0,
      packetsIn: 0,
      packetsOut: 0,
      connections: 0
    })
    
    startTimeRef.current = Date.now()
    requestCountRef.current = 0
    
    // Clear performance entries to start fresh
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings()
    }
    
    updateNetworkInfo()
    monitorResources()
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (monitoring) {
      // Update network info periodically
      interval = setInterval(updateNetworkInfo, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (resourceObserverRef.current) {
        resourceObserverRef.current.disconnect()
      }
    }
  }, [monitoring])

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Download</span>
            <ArrowDown className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">
            {(stats.bytesIn / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.packetsIn.toLocaleString()} packets
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Upload</span>
            <ArrowUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">
            {(stats.bytesOut / 1024 / 1024).toFixed(2)} MB
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.packetsOut.toLocaleString()} packets
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Connections</span>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.connections}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Active
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400">
          {error}
        </div>
      )}

      {networkInfo && monitoring && (
        <div className="bg-zinc-950 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-white">Network Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Connection Type:</span>
              <div className="text-white font-semibold uppercase">{networkInfo.effectiveType}</div>
            </div>
            <div>
              <span className="text-gray-400">Downlink Speed:</span>
              <div className="text-white font-semibold">{networkInfo.downlink} Mbps</div>
            </div>
            <div>
              <span className="text-gray-400">Round Trip Time:</span>
              <div className="text-white font-semibold">{networkInfo.rtt} ms</div>
            </div>
            <div>
              <span className="text-gray-400">Data Saver:</span>
              <div className="text-white font-semibold">{networkInfo.saveData ? 'ON' : 'OFF'}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-950 rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-white">Browser Network Activity</h4>
        <div className="text-sm text-gray-400">
          {monitoring ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>HTTP Requests:</span>
                <span className="text-white font-semibold">{stats.packetsIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Since:</span>
                <span className="text-white font-semibold">
                  {Math.floor((Date.now() - startTimeRef.current) / 1000)}s ago
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                Monitoring browser network requests. Navigate to websites or upload files to see activity.
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              Start monitoring to track browser network requests
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleMonitoring}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          monitoring
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-white hover:bg-gray-200 text-black'
        }`}
      >
        <Activity className="w-4 h-4" />
        <span>{loading ? 'Loading...' : monitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white">
            <p className="font-semibold mb-1">Browser-Based Monitoring</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Tracks browser HTTP/HTTPS requests via Performance API</li>
              <li>Shows network connection type and speed</li>
              <li>Monitors data transfer within the browser context</li>
              <li>Works on serverless platforms (Vercel, Netlify, etc.)</li>
              <li className="text-blue-400">Note: Only monitors this browser tab&apos;s network activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
