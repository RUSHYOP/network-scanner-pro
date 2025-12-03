'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Network, 
  Search, 
  Radar, 
  Zap, 
  Lock,
  Globe,
  Terminal,
  ChevronRight,
  Activity,
  Layers,
  Eye
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'DNS Enumeration',
      description: 'Discover subdomains with concurrent DNS lookups and intelligent wordlist scanning',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Radar className="w-8 h-8" />,
      title: 'Port Scanner',
      description: 'Fast TCP/UDP port scanning with service detection and banner grabbing',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: 'Packet Sniffer',
      description: 'Real-time network traffic analysis with protocol decoding',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Protocol Analysis',
      description: 'Deep packet inspection for HTTP, DNS, TCP, UDP, ICMP and more',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Security Audit',
      description: 'Identify open ports, vulnerable services, and security misconfigurations',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const stats = [
    { label: 'Protocols Supported', value: '50+' },
    { label: 'Concurrent Scans', value: '1000+' },
    { label: 'Response Time', value: '<100ms' },
    { label: 'Accuracy', value: '99.9%' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Network Scanner Pro</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#features" className="hover:text-gray-400 transition">Features</Link>
              <Link href="#how-it-works" className="hover:text-gray-400 transition">How It Works</Link>
              <Link href="/dashboard">
                <button className="bg-white text-black px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center space-x-2 text-sm md:text-base">
                  <span>Launch Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Advanced Network</span>
              <br />
              <span className="text-white">Reconnaissance Platform</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto px-4">
              Professional-grade network scanning, DNS enumeration, and packet analysis 
              with a beautiful modern interface powered by cutting-edge algorithms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2">
                  <Terminal className="w-5 h-5" />
                  <span>Start Scanning</span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Powerful Features</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Everything you need for comprehensive network reconnaissance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover-glow group cursor-pointer"
              >
                <div className="bg-white text-black w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">How It Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 px-4">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Tool',
                description: 'Select from DNS enumeration, port scanning, packet sniffing, or combined reconnaissance modes',
                icon: <Zap className="w-12 h-12" />
              },
              {
                step: '02',
                title: 'Configure Parameters',
                description: 'Set your target, choose scan intensity, apply filters, and customize the scan with our intuitive interface',
                icon: <Lock className="w-12 h-12" />
              },
              {
                step: '03',
                title: 'Analyze Results',
                description: 'View real-time results with interactive visualizations, export data, and gain actionable insights',
                icon: <Activity className="w-12 h-12" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-8 h-full">
                  <div className="text-6xl font-bold text-zinc-800 mb-4">{item.step}</div>
                  <div className="text-white mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 md:p-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Scanning?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 px-4">
              Launch the dashboard and begin your network reconnaissance journey
            </p>
            <Link href="/dashboard">
              <button className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 mx-auto max-w-xs">
                <Terminal className="w-5 h-5" />
                <span>Open Dashboard</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Network Scanner Pro - Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="mt-2 text-sm">Professional network reconnaissance made simple</p>
        </div>
      </footer>
    </div>
  )
}
