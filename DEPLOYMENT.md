# Deployment Guide - Network Scanner Pro

## Quick Start (5 minutes)

### Step 1: Prepare Your Project
```bash
cd network-scanner-pro
npm install
npm run build  # Test build locally
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### Option B: GitHub + Vercel (Recommended for Teams)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Network Scanner Pro"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/network-scanner-pro.git
git push -u origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Accept default settings
   - Click "Deploy"
   - Done! Your site is live in ~2 minutes

#### Option C: Manual Upload
1. Build the project: `npm run build`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag and drop the entire project folder
4. Click "Deploy"

---

## 🌐 Accessing Your Deployed Application

After deployment, you'll receive a URL like:
- `https://network-scanner-pro.vercel.app`
- `https://network-scanner-pro-yourusername.vercel.app`

### Custom Domain (Optional)
1. Go to Project Settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## ⚙️ Environment Variables (Optional)

If you want to customize behavior, add these in Vercel Dashboard:

1. Go to Project Settings > Environment Variables
2. Add variables:

```env
# DNS Configuration
NEXT_PUBLIC_DNS_SERVER=8.8.8.8

# Timeout Settings
NEXT_PUBLIC_DEFAULT_TIMEOUT=1000
NEXT_PUBLIC_MAX_CONCURRENCY=500

# API Rate Limiting
NEXT_PUBLIC_MAX_REQUESTS_PER_MINUTE=60
```

3. Redeploy to apply changes

---

## 📊 Monitoring & Analytics

### Check Deployment Status
```bash
vercel ls  # List all deployments
vercel inspect [url]  # Detailed deployment info
```

### View Logs
- Go to Vercel Dashboard > Your Project > Deployments
- Click on any deployment
- View "Functions" tab for API route logs
- Check "Build Logs" for build issues

---

## 🔧 Troubleshooting

### Build Fails

**Error: TypeScript errors**
```bash
# Fix locally first
npm run lint
npm run build
# Then commit and push
```

**Error: Missing dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### DNS Scan Not Working

**Issue**: CORS errors or timeouts

**Solution**: This is expected in serverless environments. Vercel has:
- 10-second timeout (Hobby)
- 60-second timeout (Pro)

**Workaround**:
- Use smaller concurrency values (10-50)
- Choose "Common" wordlist for quick scans
- For extensive scans, consider self-hosting

### Port Scanner Limitations

**Issue**: Some scans time out

**Reason**: Serverless functions have execution time limits

**Solutions**:
1. Scan smaller port ranges (e.g., 1-100 instead of 1-65535)
2. Increase timeout values
3. For comprehensive scans, use VPS deployment (see below)

---

## 🚀 Alternative Deployment Options

### Self-Hosting (Full Features)

For full packet sniffing and unlimited scan capabilities:

#### Using Docker

```bash
# Build
docker build -t network-scanner-pro .

# Run
docker run -p 3000:3000 --cap-add=NET_ADMIN network-scanner-pro
```

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### Using VPS (DigitalOcean, AWS EC2, Linode)

```bash
# SSH into your VPS
ssh user@your-server-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/YOUR_USERNAME/network-scanner-pro.git
cd network-scanner-pro
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "network-scanner" -- start
pm2 startup
pm2 save

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
# Configure nginx to proxy to localhost:3000
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 🔒 Security Considerations

### For Vercel Deployment

1. **Rate Limiting**: Already implemented in API routes
2. **CORS**: Configured for same-origin requests
3. **Input Validation**: Sanitizes user inputs

### For Self-Hosted

1. **Add Authentication**:
   - Implement login system
   - Use JWT tokens
   - Restrict to specific IPs

2. **HTTPS**:
   - Use Let's Encrypt certificates
   - Configure SSL in Nginx/Apache

3. **Firewall**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

---

## 📈 Performance Optimization

### For Vercel

1. **Enable Edge Caching**:
   ```javascript
   // In API routes
   export const config = {
     runtime: 'edge',
   }
   ```

2. **Optimize Images**:
   - Use Next.js Image component
   - Enable image optimization in vercel.json

3. **Reduce Bundle Size**:
   ```bash
   npm run build
   npm run analyze  # If you have bundle analyzer
   ```

### For Self-Hosted

1. **Enable Compression**:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Cache Static Assets**:
   ```nginx
   location /_next/static/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

---

## 🧪 Testing Your Deployment

### Basic Functionality Test

1. **Landing Page**:
   - Visit `https://your-app.vercel.app`
   - Check all animations load
   - Click navigation links

2. **Dashboard**:
   - Navigate to `/dashboard`
   - Check all tool cards display
   - Open Help & Examples modal

3. **DNS Scanner**:
   - Enter `google.com`
   - Select "Common" wordlist
   - Start scan
   - Verify results appear

4. **Port Scanner**:
   - Enter `scanme.nmap.org`
   - Ports: `80,443`
   - Start scan
   - Check results

### Performance Test

```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-app.vercel.app/

# Using wrk
wrk -t12 -c400 -d30s https://your-app.vercel.app/
```

---

## 📞 Support & Updates

### Automatic Updates (GitHub + Vercel)

Any push to `main` branch triggers automatic deployment:
```bash
git add .
git commit -m "Update: Added new feature"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

### Manual Updates (Vercel CLI)

```bash
# Update code
git pull

# Deploy
vercel --prod
```

### Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

---

## 🎉 Success Checklist

- [ ] Application deployed successfully
- [ ] Landing page loads correctly
- [ ] Dashboard is accessible
- [ ] DNS scanner works for common domains
- [ ] Port scanner identifies open ports
- [ ] Help guide is functional
- [ ] Export features work
- [ ] Mobile responsive design verified
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Project GitHub Issues](https://github.com/YOUR_USERNAME/network-scanner-pro/issues)

---

**Deployment Time**: ~3-5 minutes  
**Difficulty**: Easy  
**Cost**: Free (Vercel Hobby) or $20/month (Vercel Pro)

**Enjoy your deployed Network Scanner Pro! 🚀**
