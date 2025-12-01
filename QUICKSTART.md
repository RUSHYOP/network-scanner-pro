# 🚀 Quick Start Guide - Network Scanner Pro

## Get Running in 2 Minutes!

### 1. Install Dependencies
```bash
cd network-scanner-pro
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: **http://localhost:3000**

That's it! 🎉

---

## 📖 First-Time Usage

### Step 1: Explore the Landing Page
- Modern dark-themed interface
- Feature showcase
- Click "Launch Dashboard" to begin

### Step 2: Open the Dashboard
- See all 5 scanning tools in a grid layout
- Each tool has its own card with examples

### Step 3: Try DNS Enumeration
1. Click on "DNS Enumeration" card
2. Enter: `google.com`
3. Select: "Common" wordlist
4. Set concurrency: `100`
5. Click "Start DNS Scan"
6. Watch results appear in real-time! ✨

### Step 4: Explore Other Tools
- **Port Scanner**: Try `scanme.nmap.org` with ports `1-1000`
- **Packet Sniffer**: View network traffic (requires admin rights)
- **Network Monitor**: Track bandwidth usage
- **Security Audit**: Scan for vulnerabilities

### Step 5: Get Help
Click the "Help & Examples" button at the top for:
- Detailed usage instructions
- Example configurations
- Best practices
- Tips and tricks

---

## 🎯 Example Use Cases

### 1. Discover Subdomains
**Target**: `example.com`  
**Goal**: Find all public-facing subdomains

```
Tool: DNS Enumeration
Domain: example.com
Wordlist: Large
Concurrency: 150
```

**Expected Result**: List of subdomains like:
- www.example.com
- mail.example.com
- api.example.com
- etc.

### 2. Check Open Ports
**Target**: Your web server  
**Goal**: Verify only necessary ports are open

```
Tool: Port Scanner
Host: your-server.com
Ports: 1-1000
Type: TCP
Timeout: 1000ms
```

**Expected Result**: Open ports with service identification (HTTP, HTTPS, SSH, etc.)

### 3. Monitor Network Traffic
**Goal**: See what's happening on your network

```
Tool: Packet Sniffer
Interface: eth0
Filter: tcp port 80 (HTTP traffic)
```

**Expected Result**: Real-time packet capture showing HTTP requests

---

## 🛠️ Common Tasks

### Export Scan Results
1. Complete any scan (DNS or Port)
2. Click the "Export" button
3. Save as JSON file
4. Use for documentation or further analysis

### Run Multiple Scans
- All tools work independently
- Run DNS scan and Port scan simultaneously
- Results are isolated per tool

### Adjust Performance
- **Faster Scans**: Increase concurrency (100-200)
- **Network-Friendly**: Lower concurrency (10-50)
- **Slower Networks**: Increase timeout values

---

## ⚡ Keyboard Shortcuts & Tips

### Navigation
- Click "Back" in dashboard to return to landing page
- Logo always links to home

### Best Practices
1. **Start Small**: Use "Common" wordlist first
2. **Test Locally**: Try `localhost` or `127.0.0.1` first
3. **Permission First**: Always get authorization before scanning
4. **Export Data**: Save results for later analysis

### Performance Tips
- Close other applications for faster scans
- Use wired connection when possible
- Scan during off-peak hours for better results

---

## 🎨 Interface Guide

### Landing Page
```
┌─────────────────────────────────────┐
│  🛡️ Network Scanner Pro             │
├─────────────────────────────────────┤
│  [Features] [How It Works] [Launch] │
│                                     │
│  ✨ Hero Section                    │
│  📊 Statistics (Protocols, Speed)   │
│  🎯 Feature Cards (6 tools)         │
│  📋 How It Works (3 steps)          │
│  🚀 Call to Action                  │
└─────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────┐
│  [← Back] 🛡️ Dashboard    [❓ Help] │
├─────────────────────────────────────┤
│  💡 Welcome Banner                  │
│                                     │
│  ┌──────────┐ ┌──────────┐        │
│  │ DNS Scan │ │ Port Scan│        │
│  │  [Form]  │ │  [Form]  │        │
│  └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐        │
│  │ Packets  │ │ Monitor  │        │
│  └──────────┘ └──────────┘        │
│  ┌──────────┐                      │
│  │ Security │                      │
│  └──────────┘                      │
│                                     │
│  💡 Quick Tips                      │
└─────────────────────────────────────┘
```

---

## 🔍 Troubleshooting Quick Fixes

### "Cannot find domain"
- Check spelling
- Verify domain exists
- Check internet connection
- Try different DNS server

### "Scan timeout"
- Increase timeout value
- Reduce concurrency
- Check firewall settings
- Try smaller port range

### "No results found"
- Domain might not have subdomains
- Try different wordlist
- Check if domain is accessible
- Verify network connection

### "Permission denied" (Packet Sniffer)
- Packet capture requires admin rights
- Run terminal as administrator (Windows)
- Use `sudo` on Linux/Mac
- Or use other tools that don't require privileges

---

## 📚 Learn More

### Built-in Help
Click "Help & Examples" in dashboard for:
- Complete tool guides
- Step-by-step instructions
- Real-world examples
- Configuration tips

### Documentation
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- API routes in `app/api/` - Backend logic
- Components in `components/` - Frontend code

---

## 🎯 Next Steps

1. ✅ Complete this quick start
2. 📖 Read the help guide in the app
3. 🧪 Try all 5 tools
4. 🚀 Deploy to Vercel (see DEPLOYMENT.md)
5. 🎨 Customize for your needs
6. 📤 Share with your team!

---

## 💬 Need Help?

- 📖 Check built-in Help & Examples
- 📄 Read README.md for details
- 🐛 Found a bug? Open an issue
- 💡 Have an idea? Submit a feature request

---

**Happy Scanning! 🎉**

*Remember: Always get permission before scanning networks you don't own!*
