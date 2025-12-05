import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network Scanner Pro - Advanced Network Reconnaissance',
  description: 'Professional network scanning, DNS enumeration, and packet analysis tool with modern web interface',
}

// Export viewport separately per Next.js metadata API guidance
export const viewport = 'width=device-width, initial-scale=1, maximum-scale=5'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
