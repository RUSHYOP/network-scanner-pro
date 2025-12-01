'use client'

import { X, BookOpen, Terminal, Search, Radar, Network } from 'lucide-react'

interface HelpGuideProps {
  onClose: () => void
}

export default function HelpGuide({ onClose }: HelpGuideProps) {
  const guides = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'DNS Enumeration Guide',
      color: 'from-blue-500 to-cyan-500',
      steps: [
        'Enter a target domain (e.g., example.com)',
        'Choose wordlist size: Common for quick scans, Large for comprehensive discovery',
        'Set concurrency level (50-200 recommended for most networks)',
        'Click "Start DNS Scan" and watch results appear in real-time',
        'Export results as JSON for further analysis or documentation'
      ],
      examples: [
        'Target: google.com, Wordlist: Common, Concurrency: 100',
        'Target: github.com, Wordlist: Medium, Concurrency: 150',
        'Target: your-company.com, Wordlist: Large, Concurrency: 200'
      ]
    },
    {
      icon: <Radar className="w-6 h-6" />,
      title: 'Port Scanner Guide',
      color: 'from-purple-500 to-pink-500',
      steps: [
        'Enter target IP address or hostname',
        'Specify port range: Use "1-1000" for common ports, "1-65535" for full scan',
        'Choose scan type: TCP (reliable), SYN (stealthy, requires privileges)',
        'Adjust timeout based on network speed (1000ms default)',
        'Review open ports with identified services'
      ],
      examples: [
        'Quick scan: scanme.nmap.org, Ports: 1-1000, Type: TCP',
        'Web server: example.com, Ports: 80,443,8080, Type: TCP',
        'Database scan: 192.168.1.100, Ports: 3306,5432,27017, Type: TCP'
      ]
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'Packet Sniffer Guide',
      color: 'from-green-500 to-emerald-500',
      steps: [
        'Select network interface (eth0 for Ethernet, wlan0 for WiFi)',
        'Apply BPF filter to capture specific traffic (optional but recommended)',
        'Click "Start Capture" to begin packet collection',
        'Monitor captured packets in real-time',
        'Stop capture and export to PCAP format for analysis in Wireshark'
      ],
      examples: [
        'HTTP traffic: Filter "tcp port 80"',
        'DNS queries: Filter "udp port 53"',
        'All traffic from host: Filter "host 192.168.1.1"',
        'HTTPS traffic: Filter "tcp port 443"'
      ]
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Help & Usage Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* General Info */}
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold mb-3">Getting Started</h3>
            <p className="text-gray-400 mb-4">
              Network Scanner Pro combines powerful reconnaissance tools in a modern web interface. 
              Each tool is designed for specific use cases and can be used independently or together 
              for comprehensive network analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <div className="font-semibold text-green-400 mb-1">✓ Best Practices</div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Always get permission before scanning</li>
                  <li>• Start with non-intrusive scans</li>
                  <li>• Adjust concurrency based on network</li>
                  <li>• Document all findings properly</li>
                </ul>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                <div className="font-semibold text-yellow-400 mb-1">⚠ Important Notes</div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Packet sniffing requires admin rights</li>
                  <li>• Some scans may trigger IDS/IPS</li>
                  <li>• Respect rate limits and timeouts</li>
                  <li>• Export results for offline analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tool Guides */}
          {guides.map((guide, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`bg-gradient-to-br ${guide.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  {guide.icon}
                </div>
                <h3 className="text-xl font-bold">{guide.title}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Step-by-Step Instructions:</h4>
                  <ol className="space-y-2">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-gray-400 text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Example Usage:</h4>
                  <div className="space-y-2">
                    {guide.examples.map((example, i) => (
                      <div key={i} className="bg-black/40 border border-white/10 rounded p-3">
                        <div className="flex items-start space-x-2">
                          <Terminal className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <code className="text-xs text-gray-300 font-mono">{example}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Keyboard Shortcuts */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Tips & Tricks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                <div className="font-semibold text-blue-400 mb-2">💡 Performance</div>
                <p className="text-sm text-gray-400">
                  Higher concurrency = faster scans, but may overwhelm networks. Start low and increase gradually.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                <div className="font-semibold text-purple-400 mb-2">🎯 Accuracy</div>
                <p className="text-sm text-gray-400">
                  Use appropriate timeouts. Slow networks need higher timeouts to avoid false negatives.
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                <div className="font-semibold text-green-400 mb-2">📊 Analysis</div>
                <p className="text-sm text-gray-400">
                  Export results in JSON format for integration with other tools or custom analysis scripts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
