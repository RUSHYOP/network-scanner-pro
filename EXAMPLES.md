# Network Scanner Pro - Complete Usage Examples

## 🎯 Real-World Scenarios

### Scenario 1: Website Security Audit

**Objective**: Audit a website for security issues

**Steps**:

1. **Discover Subdomains**
   ```
   Tool: DNS Enumeration
   Target: example.com
   Wordlist: Large
   Concurrency: 150
   
   Results:
   ✓ www.example.com → 93.184.216.34
   ✓ api.example.com → 93.184.216.35
   ✓ admin.example.com → 93.184.216.36
   ✓ dev.example.com → 192.168.1.100 (Private!)
   
   Finding: dev.example.com exposed on public DNS
   ```

2. **Scan Main Server**
   ```
   Tool: Port Scanner
   Target: example.com
   Ports: 1-10000
   Type: TCP
   Timeout: 1500ms
   
   Results:
   ✓ Port 22 (SSH) - Open
   ✓ Port 80 (HTTP) - Open
   ✓ Port 443 (HTTPS) - Open
   ✓ Port 8080 (HTTP-Proxy) - Open (Unexpected!)
   
   Finding: Port 8080 shouldn't be exposed
   ```

3. **Security Audit**
   ```
   Tool: Security Audit
   Target: example.com
   
   Findings:
   🔴 CRITICAL: SSH exposed on port 22
   🟠 HIGH: Weak SSL/TLS configuration
   🟡 MEDIUM: Missing security headers
   🔵 LOW: Server version disclosure
   ```

**Action Items**:
- Close port 8080
- Move SSH to non-standard port
- Update SSL configuration
- Add security headers
- Remove dev.example.com from public DNS

---

### Scenario 2: Infrastructure Mapping

**Objective**: Map company network infrastructure

**Steps**:

1. **Enumerate All Subdomains**
   ```
   Tool: DNS Enumeration
   Target: company.com
   Wordlist: Large
   Concurrency: 200
   
   Discovered:
   - mail.company.com
   - vpn.company.com
   - portal.company.com
   - api.company.com
   - cdn.company.com
   - staging.company.com
   - test.company.com
   
   Total: 42 subdomains found
   ```

2. **Identify Services**
   ```
   For each subdomain, run Port Scanner:
   
   mail.company.com:
   ✓ 25 (SMTP)
   ✓ 143 (IMAP)
   ✓ 587 (SMTP Submission)
   ✓ 993 (IMAPS)
   
   vpn.company.com:
   ✓ 443 (HTTPS)
   ✓ 1194 (OpenVPN)
   
   api.company.com:
   ✓ 443 (HTTPS)
   ✓ 8443 (REST API)
   ```

3. **Create Network Map**
   ```
   Export all results to JSON
   Use data to create infrastructure diagram
   Document all discovered assets
   ```

---

### Scenario 3: Troubleshooting Connectivity

**Objective**: Debug why application can't connect to database

**Steps**:

1. **Verify DNS Resolution**
   ```
   Tool: DNS Enumeration
   Target: db.internal.company.com
   
   Result: ✓ Resolves to 10.0.1.50
   ```

2. **Check Port Accessibility**
   ```
   Tool: Port Scanner
   Target: 10.0.1.50
   Ports: 3306,5432,27017
   Type: TCP
   Timeout: 2000ms
   
   Results:
   ✗ Port 3306 (MySQL) - Filtered
   ✓ Port 5432 (PostgreSQL) - Open
   ✗ Port 27017 (MongoDB) - Closed
   
   Finding: MySQL port is filtered by firewall
   ```

3. **Monitor Network Traffic**
   ```
   Tool: Packet Sniffer
   Interface: eth0
   Filter: host 10.0.1.50 and port 3306
   
   Observation: No SYN-ACK responses
   Conclusion: Firewall blocking connection
   ```

**Solution**: Update firewall rules to allow MySQL traffic

---

### Scenario 4: Pre-Production Checklist

**Objective**: Verify production deployment security

**Pre-Deployment Checklist**:

1. **DNS Configuration**
   ```
   Tool: DNS Enumeration
   Target: newapp.company.com
   
   Verify:
   ✓ Production domain resolves
   ✗ Staging domains not publicly accessible
   ✗ Development domains not in public DNS
   ✓ CDN properly configured
   ```

2. **Port Security**
   ```
   Tool: Port Scanner
   Target: newapp.company.com
   Ports: 1-65535
   
   Expected Open:
   ✓ 80 (HTTP - should redirect)
   ✓ 443 (HTTPS)
   
   Should be Closed:
   ✗ 22 (SSH) - FAIL if open
   ✗ 3306 (MySQL) - FAIL if open
   ✗ 27017 (MongoDB) - FAIL if open
   ✗ 8080 (HTTP-Alt) - FAIL if open
   ```

3. **Security Validation**
   ```
   Tool: Security Audit
   Target: newapp.company.com
   
   Must Pass:
   ✓ Strong SSL/TLS (A+ rating)
   ✓ Security headers present
   ✓ No version disclosure
   ✓ No default credentials
   ✓ Rate limiting enabled
   ```

**Deploy if all checks pass** ✅

---

### Scenario 5: Competitive Analysis

**Objective**: Analyze competitor infrastructure (public information only)

**Legal Note**: Only scan public-facing infrastructure

**Steps**:

1. **Discover Public Presence**
   ```
   Tool: DNS Enumeration
   Target: competitor.com
   Wordlist: Common
   
   Found:
   - www.competitor.com
   - blog.competitor.com
   - api.competitor.com
   - cdn.competitor.com
   - shop.competitor.com
   ```

2. **Technology Stack Detection**
   ```
   Tool: Port Scanner
   Target: competitor.com
   Ports: 80,443,8080,8443
   
   Banner Grabbing Results:
   Port 80: nginx/1.18.0
   Port 443: TLS 1.3 (CloudFlare)
   
   Insights:
   - Using Nginx web server
   - Behind CloudFlare CDN
   - Modern TLS configuration
   ```

3. **API Discovery**
   ```
   Tool: DNS Enumeration
   Target: api.competitor.com
   
   Found endpoints:
   - api-v1.competitor.com
   - api-v2.competitor.com
   - api-staging.competitor.com (Oops!)
   
   Note: Staging API should not be public
   ```

---

### Scenario 6: IoT Device Discovery

**Objective**: Find all IoT devices on network

**Network**: 192.168.1.0/24

**Steps**:

1. **Scan Common IoT Ports**
   ```
   Tool: Port Scanner
   Target: 192.168.1.1 (then .2, .3, etc.)
   Ports: 80,443,554,8080,8554,5000,9000
   
   Found Devices:
   192.168.1.100: Port 554 (RTSP) - IP Camera
   192.168.1.101: Port 8080 (HTTP) - Smart Hub
   192.168.1.150: Port 9000 (HTTP) - NAS Device
   192.168.1.200: Port 80 (HTTP) - Smart Thermostat
   ```

2. **Identify Device Types**
   ```
   For each found device:
   
   192.168.1.100:
   Service: RTSP (Real Time Streaming Protocol)
   Device: IP Security Camera
   Banner: "Hikvision DS-2CD2142FWD"
   
   192.168.1.101:
   Service: HTTP Web Interface
   Device: Smart Home Hub
   Banner: "Home Assistant"
   ```

3. **Security Assessment**
   ```
   Tool: Security Audit
   
   Findings:
   🔴 192.168.1.100: Default credentials
   🟠 192.168.1.101: No HTTPS
   🟡 192.168.1.150: Outdated firmware
   ✅ 192.168.1.200: Secure configuration
   ```

---

## 📋 Usage Templates

### Template 1: Weekly Security Scan

**Frequency**: Every Monday morning

```bash
# 1. DNS Scan
Target: company-domain.com
Wordlist: Large
Concurrency: 100
Export: dns-scan-YYYY-MM-DD.json

# 2. Port Scan (Critical Systems)
Targets: 
  - webserver.company.com (Ports: 80,443)
  - mailserver.company.com (Ports: 25,587,993)
  - vpn.company.com (Ports: 443,1194)
Export: port-scan-YYYY-MM-DD.json

# 3. Security Audit
Targets: All public-facing systems
Compare: Against previous week's results
Export: security-audit-YYYY-MM-DD.json

# 4. Generate Report
Changes: Highlight any new findings
Action Items: Create tickets for issues
```

### Template 2: New Server Setup

**Use**: When provisioning new servers

```bash
# Pre-Deployment
1. Verify DNS records exist
2. Ensure only required ports open
3. Confirm no default credentials
4. Check firewall rules

# Post-Deployment
1. DNS scan to confirm resolution
2. Port scan to verify configuration
3. Security audit for compliance
4. Document findings
```

### Template 3: Incident Response

**Use**: When security incident occurs

```bash
# Immediate Actions
1. Port scan affected systems
2. Identify unexpected open ports
3. Capture network traffic
4. Document current state

# Investigation
1. Compare against baseline scans
2. Identify anomalies
3. Track lateral movement
4. Collect evidence

# Remediation
1. Close unauthorized ports
2. Update firewall rules
3. Patch vulnerabilities
4. Re-scan to verify fixes
```

---

## 🎓 Learning Exercises

### Exercise 1: Your First Scan

**Objective**: Learn basic DNS enumeration

**Target**: `google.com` (safe to scan)

**Steps**:
1. Open Network Scanner Pro
2. Navigate to Dashboard
3. Select DNS Enumeration
4. Enter `google.com`
5. Choose "Common" wordlist
6. Set concurrency to 50
7. Click "Start DNS Scan"
8. Observe results
9. Export to JSON

**Expected Results**: 
- www.google.com
- mail.google.com
- And several others

### Exercise 2: Port Scanning Basics

**Objective**: Identify common services

**Target**: `scanme.nmap.org` (intentionally scannable)

**Steps**:
1. Use Port Scanner tool
2. Enter target
3. Scan ports 1-1000
4. Note which ports are open
5. Identify services

**Expected Open Ports**:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 9929 (nping-echo)

### Exercise 3: Complete Audit

**Objective**: Perform full security assessment

**Target**: Your own website/server

**Steps**:
1. DNS enumeration
2. Port scanning
3. Service identification
4. Security audit
5. Document findings
6. Create remediation plan

---

## 💡 Pro Tips

### Optimization

**For Speed**:
- Increase concurrency to 200-300
- Use smaller wordlists
- Scan specific port ranges
- Use faster DNS servers

**For Accuracy**:
- Decrease concurrency to 10-50
- Increase timeout values
- Use larger wordlists
- Run scans during off-peak

**For Stealth** (ethical testing only):
- Lower concurrency
- Randomize scan order
- Use longer timeouts
- Scan over longer periods

### Best Practices

1. **Always Get Permission**
   - Document authorization
   - Respect scope boundaries
   - Follow rules of engagement

2. **Document Everything**
   - Export all scan results
   - Take screenshots
   - Note timestamps
   - Record methodology

3. **Be Responsible**
   - Don't overload targets
   - Respect rate limits
   - Avoid peak hours
   - Stop if issues occur

4. **Continuous Improvement**
   - Compare against baselines
   - Track changes over time
   - Update wordlists
   - Refine techniques

---

## 📚 Additional Resources

### Commands Quick Reference

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production

# Maintenance
npm install          # Install dependencies
npm update           # Update packages
```

### Common BPF Filters

```bash
# HTTP traffic
tcp port 80

# HTTPS traffic
tcp port 443

# DNS queries
udp port 53

# SSH connections
tcp port 22

# All traffic from host
host 192.168.1.100

# All traffic between two hosts
host 192.168.1.100 and host 192.168.1.200

# Specific protocol
tcp or udp or icmp
```

---

**Remember**: With great power comes great responsibility. Always use these tools ethically and legally!

Happy scanning! 🎉
