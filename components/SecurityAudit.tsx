'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function SecurityAudit() {
  const [target, setTarget] = useState('')
  const [auditing, setAuditing] = useState(false)
  const [findings, setFindings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const severityColors = {
    critical: 'bg-red-500/20 border-red-500 text-red-400',
    high: 'bg-orange-500/20 border-orange-500 text-orange-400',
    medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    low: 'bg-blue-500/20 border-blue-500 text-blue-400',
    info: 'bg-gray-500/20 border-gray-500 text-gray-400'
  }

  const handleAudit = async () => {
    if (!target.trim()) {
      setError('Please enter a target to audit')
      return
    }

    setLoading(true)
    setAuditing(true)
    setError('')
    setFindings([])

    try {
      const response = await fetch('/api/security-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target: target.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform security audit')
      }

      setFindings(data.findings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setAuditing(false)
    }
  }

  const getSeverityCounts = () => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }
    findings.forEach(finding => {
      if (counts.hasOwnProperty(finding.severity)) {
        counts[finding.severity as keyof typeof counts]++
      }
    })
    return counts
  }

  const severityCounts = getSeverityCounts()

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Target to Audit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1 or example.com"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleAudit}
          disabled={!target || loading}
          className="w-full bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>{loading ? 'Auditing...' : 'Start Security Audit'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400">
          {error}
        </div>
      )}

      {findings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">Security Findings</h4>
            <div className="flex gap-2 text-xs">
              {severityCounts.critical > 0 && (
                <span className="px-2 py-1 rounded bg-red-500/20 text-red-400">
                  {severityCounts.critical} Critical
                </span>
              )}
              {severityCounts.high > 0 && (
                <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400">
                  {severityCounts.high} High
                </span>
              )}
              {severityCounts.medium > 0 && (
                <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                  {severityCounts.medium} Medium
                </span>
              )}
              {severityCounts.low > 0 && (
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                  {severityCounts.low} Low
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {findings.map((finding, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-3 ${severityColors[finding.severity as keyof typeof severityColors]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold">{finding.title}</div>
                      <div className="text-sm opacity-80 mt-1">{finding.description}</div>
                      {finding.recommendation && (
                        <div className="text-xs mt-2 p-2 bg-black/20 rounded">
                          <span className="font-semibold">Recommendation:</span> {finding.recommendation}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded uppercase font-semibold whitespace-nowrap ml-2">
                    {finding.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="text-sm text-white">
          <p className="font-semibold mb-1">Security Audit Checks:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Open ports and unnecessary services</li>
            <li>Weak SSL/TLS configurations</li>
            <li>Missing security headers</li>
            <li>Known CVEs and vulnerabilities</li>
            <li>Default credentials detection</li>
            <li>Information disclosure issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
