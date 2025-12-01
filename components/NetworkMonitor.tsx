'use client'

import { useState, useEffect } from 'react'
import { Activity, ArrowUp, ArrowDown } from 'lucide-react'

export default function NetworkMonitor() {
  const [stats, setStats] = useState({
    bytesIn: 0,
    bytesOut: 0,
    packetsIn: 0,
    packetsOut: 0,
    connections: 0
  })

  return (
    <div className="space-y-4">
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

      <div className="bg-zinc-950 rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-white">Active Connections</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <div className="text-sm text-gray-400 text-center py-4">
            Start monitoring to view active connections
          </div>
        </div>
      </div>

      <button className="w-full bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2">
        <Activity className="w-4 h-4" />
        <span>Start Monitoring</span>
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="text-sm text-white">
          <p className="font-semibold mb-1">Network Monitoring Features:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Real-time bandwidth usage tracking</li>
            <li>Active connection monitoring</li>
            <li>Per-process network activity</li>
            <li>Historical data visualization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
