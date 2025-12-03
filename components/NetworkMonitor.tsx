'use client'

import { AlertCircle, Activity } from 'lucide-react'

export default function NetworkMonitor() {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Activity className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Network Monitor</h3>
          <p className="text-gray-400 max-w-md">
            System-level network monitoring requires native access to network interfaces, 
            which is not available in browser-based applications.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white">
            <p className="font-semibold mb-1">Why is this unavailable?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Real network monitoring requires OS-level access</li>
              <li>Browser security prevents direct network interface access</li>
              <li>Use native tools like Wireshark or netstat for monitoring</li>
              <li>The other tools (Port Scan, DNS Scan, Security Audit) work via API calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
