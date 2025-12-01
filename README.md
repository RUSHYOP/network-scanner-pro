# Network Scanner Pro

A powerful, modern web-based network reconnaissance platform combining DNS enumeration, port scanning, packet sniffing, and security auditing capabilities with a beautiful dark-themed React interface.

![Network Scanner Pro](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### DNS Enumeration
- Concurrent subdomain discovery with customizable wordlists
- Support for common, medium, and large wordlist sizes
- Real-time progress tracking
- JSON export functionality
- IP address resolution

### Port Scanner
- Fast TCP/UDP port scanning
- Service detection and banner grabbing
- Customizable port ranges
- Adjustable timeout settings
- Open port identification with service names

### Packet Sniffer
- Real-time network traffic capture
- BPF (Berkeley Packet Filter) support
- Protocol decoding (TCP, UDP, ICMP, HTTP, DNS)
- PCAP export functionality
- Multi-interface support

### Network Monitor
- Live bandwidth usage tracking
- Active connection monitoring
- Upload/download statistics
- Packet count tracking

### Security Audit
- Vulnerability scanning
- SSL/TLS configuration checks
- Security header analysis
- Open port security assessment

## 📋 Prerequisites

- Node.js 18+ or later
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

## 🛠️ Installation

### Local Development

1. **Clone or navigate to the project directory:**
   ```bash
   cd network-scanner-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/network-scanner-pro)

#### Option 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

#### Option 3: Git Integration

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/network-scanner-pro.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

## 📖 Usage Guide

### DNS Enumeration

1. Navigate to the Dashboard
2. Find the "DNS Enumeration" card
3. Enter your target domain (e.g., `example.com`)
4. Choose a wordlist size:
   - **Common**: 35 entries - Quick scans
   - **Medium**: ~3,500 entries - Balanced discovery
   - **Large**: ~350,000 entries - Comprehensive enumeration
5. Set concurrency level (50-200 recommended)
6. Click "Start DNS Scan"
7. View results in real-time
8. Export as JSON for further analysis

**Example:**
```
Target: google.com
Wordlist: Common
Concurrency: 100
```

### Port Scanner

1. Enter target IP or hostname (e.g., `192.168.1.1` or `scanme.nmap.org`)
2. Specify port range:
   - Single port: `80`
   - Range: `1-1000`
   - Multiple: `80,443,8080`
3. Select scan type:
   - **TCP**: Most reliable, works everywhere
   - **UDP**: For UDP services
   - **SYN**: Stealth scanning (requires privileges)
4. Adjust timeout (1000ms default)
5. Click "Start Port Scan"
6. Review open ports with service identification

**Example:**
```
Target: scanme.nmap.org
Ports: 1-1000
Type: TCP
Timeout: 1000ms
```

### Packet Sniffer

⚠️ **Note**: Requires administrator/root privileges

1. Select network interface (eth0, wlan0, or any)
2. Apply BPF filter (optional):
   - HTTP traffic: `tcp port 80`
   - DNS queries: `udp port 53`
   - Specific host: `host 192.168.1.1`
   - HTTPS: `tcp port 443`
3. Click "Start Capture"
4. View packets in real-time
5. Export to PCAP format for analysis in Wireshark

### Network Monitor

1. Click "Start Monitoring"
2. View real-time statistics:
   - Download/Upload bandwidth
   - Packet counts
   - Active connections
3. Monitor network activity continuously

### Security Audit

1. Enter target to audit
2. Click "Start Security Audit"
3. Review findings by severity:
   - **Critical**: Immediate action required
   - **High**: Important vulnerabilities
   - **Medium**: Should be addressed
   - **Low**: Minor issues
   - **Info**: Informational findings
4. Export report for documentation

## 🎨 Features & Interface

- **Modern Dark Theme**: Easy on the eyes for long scanning sessions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live progress bars and results streaming
- **Interactive Components**: Tooltips, examples, and guided workflows
- **Export Functionality**: JSON exports for all scan results
- **Help & Examples**: Built-in usage guides and examples

## ⚠️ Important Notes

### Legal & Ethical Considerations

- **Authorization Required**: Always obtain explicit permission before scanning networks you don't own
- **Compliance**: Ensure compliance with local laws and regulations
- **Responsible Use**: Use this tool for legitimate security testing and educational purposes only
- **Liability**: Unauthorized network scanning may be illegal in your jurisdiction

### Technical Limitations on Vercel

Vercel is a serverless platform with some limitations:

1. **Execution Time**: API routes have a 10-second timeout on Hobby plan (60s on Pro)
2. **Packet Sniffing**: Raw socket access not available in serverless environment
3. **Privileges**: Cannot run operations requiring root/admin access
4. **Best For**: DNS enumeration and basic port scanning work well
5. **Alternative**: For full features, consider self-hosting or VPS deployment

### Performance Tips

1. **DNS Scanning**:
   - Start with "Common" wordlist
   - Increase concurrency gradually
   - Monitor for rate limiting

2. **Port Scanning**:
   - Scan common ports first (1-1000)
   - Increase timeout for slow networks
   - Use reasonable batch sizes

3. **Network Optimization**:
   - Close unnecessary applications
   - Use wired connection when possible
   - Respect target server resources

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Optional: Custom DNS server
NEXT_PUBLIC_DNS_SERVER=8.8.8.8

# Optional: Default timeout values
NEXT_PUBLIC_DEFAULT_TIMEOUT=1000

# Optional: Max concurrency
NEXT_PUBLIC_MAX_CONCURRENCY=500
```

### Customization

Edit `tailwind.config.ts` to customize colors and theme:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // Add your custom colors
    }
  }
}
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational and authorized security testing purposes only.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Deployment](https://vercel.com/docs)

## 💡 Troubleshooting

### DNS Scan Not Working
- Check internet connection
- Verify target domain is valid
- Reduce concurrency level
- Check for DNS rate limiting

### Port Scan Timeouts
- Increase timeout value
- Check firewall settings
- Verify target is reachable
- Use smaller port ranges

### Deployment Issues
- Ensure Node.js version is 18+
- Check all dependencies are installed
- Verify environment variables
- Review Vercel logs

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the help guide in the dashboard

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
