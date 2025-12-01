'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Search, 
  Radar, 
  Network, 
  Activity,
  Eye,
  ArrowLeft,
  HelpCircle
} from 'lucide-react'
import DnsScanner from '@/components/DnsScanner'
import PortScanner from '@/components/PortScanner'
import PacketSniffer from '@/components/PacketSniffer'
import NetworkMonitor from '@/components/NetworkMonitor'
import SecurityAudit from '@/components/SecurityAudit'
import HelpGuide from '@/components/HelpGuide'

export default function Dashboard() {
  const [showHelp, setShowHelp] = useState(false)

  const tools = [
    {
      id: 'dns',
      title: 'DNS Enumeration',
      icon: <Search className="w-6 h-6" />,
      description: 'Discover subdomains and DNS records',
      component: <DnsScanner />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'port',
      title: 'Port Scanner',
      icon: <Radar className="w-6 h-6" />,
      description: 'Scan TCP/UDP ports and detect services',
      component: <PortScanner />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'packet',
      title: 'Packet Sniffer',
      icon: <Network className="w-6 h-6" />,
      description: 'Capture and analyze network packets',
      component: <PacketSniffer />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'monitor',
      title: 'Network Monitor',
      icon: <Activity className="w-6 h-6" />,
      description: 'Real-time traffic monitoring',
      component: <NetworkMonitor />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'security',
      title: 'Security Audit',
      icon: <Eye className="w-6 h-6" />,
      description: 'Identify vulnerabilities and risks',
      component: <SecurityAudit />,
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="flex items-center space-x-1 md:space-x-2 hover:text-gray-400 transition">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Back</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                <span className="text-base md:text-xl font-bold text-white hidden sm:inline">Network Scanner Dashboard</span>
                <span className="text-base md:text-xl font-bold text-white sm:hidden">Dashboard</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center space-x-1 md:space-x-2 glass-card px-3 md:px-4 py-2 rounded-lg hover-glow text-white"
            >
              <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base hidden sm:inline">Help & Examples</span>
              <span className="text-sm md:text-base sm:hidden">Help</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Help Guide Modal */}
      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Introduction Banner */}
        <div className="glass-card p-4 md:p-6 mb-6 md:mb-8 border-l-4 border-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Welcome to Network Scanner Pro</h2>
          <p className="text-sm md:text-base text-gray-400">
            Select any tool below to begin your network reconnaissance. Each tool includes built-in examples and step-by-step guides.
            Click the <span className="text-white font-semibold">Help & Examples</span> button above for detailed usage instructions.
          </p>
        </div>

        {/* Tools Grid - Flexbox Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="glass-card p-4 md:p-6 hover-glow"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="bg-white text-black w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white">{tool.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400">{tool.description}</p>
                  </div>
                </div>
              </div>

              {/* Tool Component */}
              <div className="mt-4">
                {tool.component}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="glass-card p-3 md:p-4 border-l-4 border-white">
            <h4 className="font-semibold mb-2 text-white text-sm md:text-base">💡 Quick Tip</h4>
            <p className="text-xs md:text-sm text-gray-400">
              Start with DNS enumeration to discover subdomains, then use port scanner to identify open services.
            </p>
          </div>
          <div className="glass-card p-3 md:p-4 border-l-4 border-white">
            <h4 className="font-semibold mb-2 text-white text-sm md:text-base">⚠️ Important</h4>
            <p className="text-xs md:text-sm text-gray-400">
              Always ensure you have permission to scan target networks. Unauthorized scanning may be illegal.
            </p>
          </div>
          <div className="glass-card p-3 md:p-4 border-l-4 border-white">
            <h4 className="font-semibold mb-2 text-white text-sm md:text-base">🚀 Pro Tip</h4>
            <p className="text-xs md:text-sm text-gray-400">
              Combine multiple tools for comprehensive reconnaissance. Export results for offline analysis.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
