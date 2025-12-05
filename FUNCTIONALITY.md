# Network Scanner Pro - Functionality Documentation

This document explains how each feature in Network Scanner Pro works, including the technical implementation details.

---

## Table of Contents

1. [DNS Enumeration](#1-dns-enumeration)
2. [Port Scanner](#2-port-scanner)
3. [Packet Sniffer](#3-packet-sniffer)
4. [Security Audit](#4-security-audit)

---

## 1. DNS Enumeration

### Purpose
Discovers subdomains of a target domain by performing DNS lookups against a wordlist of common subdomain names.

### How It Works

**Frontend (`components/DnsScanner.tsx`):**
- User inputs a target domain (e.g., `example.com`)
- User selects a wordlist size: Common (100), Medium (1K), or Large (10K)
- User sets concurrency level (how many DNS lookups run simultaneously)
- Results stream in real-time as subdomains are discovered

**Backend (`app/api/dns-scan/route.ts`):**
1. Receives the target domain, wordlist type, and concurrency setting
2. Uses Node.js `dns.resolve4()` to perform A record lookups
3. For each subdomain in the wordlist:
   - Constructs the full hostname: `{subdomain}.{target}`
   - Attempts DNS resolution
   - If successful, returns the subdomain and resolved IP address
4. Results are streamed using `ReadableStream` for real-time updates
5. Progress percentage is calculated and sent to the frontend

**Technical Details:**
- Uses `util.promisify()` to convert callback-based DNS functions to Promises
- Processes subdomains in batches based on concurrency setting
- Streams results using chunked transfer encoding

**Example Output:**
```json
{
  "subdomain": "www.example.com",
  "ip": "93.184.216.34"
}
```

---

## 2. Port Scanner

### Purpose
Scans TCP ports on a target host to identify open services, with optional banner grabbing to detect service versions.

### How It Works

**Frontend (`components/PortScanner.tsx`):**
- User inputs target host/IP (e.g., `192.168.1.1` or `scanme.nmap.org`)
- User specifies port range (e.g., `1-1000`, `22,80,443`, or `1-65535`)
- User selects scan type (TCP/UDP)
- User sets connection timeout
- Results show open ports with service names

**Backend (`app/api/port-scan/route.ts`):**
1. Parses the port range string into an array of port numbers
2. For each port, creates a TCP socket connection:
   - **Connect success** → Port is `open`
   - **Timeout** → Port is `filtered` (firewall may be blocking)
   - **Error/Refused** → Port is `closed`
3. Attempts banner grabbing on open ports (reads initial data sent by the service)
4. Results stream in real-time with progress updates

**Technical Details:**
- Uses Node.js `net.Socket` for TCP connections
- Scans ports in batches of 50 for performance
- Includes a service name lookup table for common ports (SSH, HTTP, MySQL, etc.)

**Port States:**
| State | Meaning |
|-------|---------|
| `open` | Port is accepting connections |
| `closed` | Port actively refused the connection |
| `filtered` | No response (likely firewalled) |

**Example Output:**
```json
{
  "port": 22,
  "state": "open",
  "banner": "SSH-2.0-OpenSSH_8.9"
}
```

---

## 3. Packet Sniffer

### Purpose
Captures and analyzes network packets to understand traffic patterns and protocols in use.

### How It Works

**Frontend (`components/PacketSniffer.tsx`):**
- User selects a network interface (eth0, wlan0, or all)
- User optionally sets a BPF filter (e.g., `tcp port 80`)
- Clicking "Start Capture" initiates packet collection
- Results display timestamp, source, destination, protocol, and packet info

**Backend (`app/api/packet-sniffer/route.ts`):**
1. Receives interface name, filter, and capture duration
2. **Important:** Real packet capture requires root/admin privileges and system tools (tcpdump, WinPcap)
3. For web-based deployment (Vercel), generates **simulated packet data** that mimics real network traffic
4. Returns packets with realistic attributes:
   - Timestamp
   - Source/Destination IP:Port
   - Protocol (TCP, UDP, ICMP, HTTP, HTTPS, DNS)
   - Packet length
   - Protocol-specific info (flags, queries, etc.)

**Simulated Protocols:**
| Protocol | Example Info |
|----------|-------------|
| TCP | SYN, ACK, PSH, FIN, RST flags |
| UDP | Packet length |
| ICMP | Echo request/reply |
| HTTP | GET, POST requests |
| HTTPS | TLS handshake messages |
| DNS | Query types (A, PTR) |

**Note:** For actual packet capture in a local environment, you would need:
- Linux/Mac: `tcpdump` with root privileges
- Windows: WinPcap/Npcap with admin privileges
- A library like `node-pcap`

---

## 4. Security Audit

### Purpose
Performs automated security assessments to identify vulnerabilities, misconfigurations, and security risks.

### How It Works

**Frontend (`components/SecurityAudit.tsx`):**
- User inputs target IP or domain
- Clicking "Start Security Audit" runs multiple security checks
- Results are categorized by severity (Critical, High, Medium, Low)
- Each finding includes a description and remediation recommendation

**Backend (`app/api/security-audit/route.ts`):**
Performs 5 categories of security checks:

### Check 1: Open Port Analysis
- Scans for dangerous ports that are commonly exploited
- Flags ports like:
  - Port 23 (Telnet) - Critical: Unencrypted remote access
  - Port 21 (FTP) - High: Often misconfigured
  - Port 445 (SMB) - High: Target for ransomware
  - Port 3389 (RDP) - Medium: Brute force target

### Check 2: SSL/TLS Configuration
- Checks if HTTPS is available
- Validates certificate expiration
- Detects weak TLS versions (TLS 1.0, 1.1)
- Checks for self-signed certificates

### Check 3: HTTP Security Headers
- Analyzes HTTP response headers for security best practices:
  - `X-Frame-Options` - Clickjacking protection
  - `X-Content-Type-Options` - MIME sniffing prevention
  - `Strict-Transport-Security` - HSTS enforcement
  - `Content-Security-Policy` - XSS protection
  - `X-XSS-Protection` - Legacy XSS filter

### Check 4: DNS Security
- Checks for DNSSEC configuration
- Verifies SPF records for email security
- Checks for open DNS resolvers

### Check 5: Information Disclosure
- Detects exposed server version headers
- Identifies directory listing vulnerabilities
- Checks for exposed debug endpoints
- Looks for backup file exposure

**Severity Levels:**
| Level | Color | Meaning |
|-------|-------|---------|
| Critical | Red | Immediate action required |
| High | Orange | Should be fixed soon |
| Medium | Yellow | Should be addressed |
| Low | Blue | Minor improvements |
| Info | Gray | Informational only |

**Example Output:**
```json
{
  "title": "Telnet Port 23 Open",
  "description": "Port 23 (Telnet) is open and transmits data in plaintext.",
  "severity": "critical",
  "category": "network",
  "recommendation": "Disable Telnet and use SSH for encrypted remote access."
}
```

---

## Data Export

All tools support exporting results to JSON format:
- Click the "Export" button after a scan completes
- File downloads with a timestamped filename
- JSON format is compatible with other security tools

---

## Limitations

1. **Browser-Based Constraints:**
   - No direct access to raw network sockets
   - Cannot perform actual packet capture without server-side tools
   - Some scans require server with proper network access

2. **Serverless Deployment (Vercel):**
   - Port scans may be blocked by hosting provider
   - Packet capture uses simulated data
   - Some security checks may have limited accuracy

3. **Permissions:**
   - Real packet capture requires root/admin privileges
   - Some ports may require elevated permissions to scan
   - Corporate firewalls may block scan traffic

---

## Legal Notice

⚠️ **Always ensure you have explicit permission before scanning any network or system.**

Unauthorized network scanning may violate:
- Computer Fraud and Abuse Act (CFAA)
- Computer Misuse Act
- Local cybersecurity laws

Only scan networks you own or have written authorization to test.
