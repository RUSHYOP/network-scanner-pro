# Network Scanner Pro - Technical Documentation

This document describes how the project was built, the technology stack, architecture decisions, and development methodology.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Architecture](#project-architecture)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Styling & Design System](#styling--design-system)
6. [Development Methodology](#development-methodology)
7. [Deployment](#deployment)
8. [Project Structure](#project-structure)

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1.0 | React framework with App Router |
| **React** | 19.0.0 | UI component library |
| **TypeScript** | 5.7.2 | Type-safe JavaScript |

### Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **PostCSS** | 8.4.49 | CSS processing |
| **Autoprefixer** | 10.4.20 | Browser compatibility |

### UI Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| **Lucide React** | 0.468.0 | Icon library |
| **Framer Motion** | 11.15.0 | Animation library |
| **Recharts** | 2.15.0 | Data visualization |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.17.0 | Code linting |
| **eslint-config-next** | 15.1.0 | Next.js ESLint rules |

### Node.js Built-in Modules (Backend)
- `dns` - DNS resolution for subdomain enumeration
- `net` - TCP socket connections for port scanning
- `https` - SSL/TLS checking
- `child_process` - System command execution
- `util` - Promisify utilities

---

## Project Architecture

### Next.js App Router Structure

```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx            # Landing page (/)
├── globals.css         # Global styles
├── dashboard/
│   └── page.tsx        # Dashboard page (/dashboard)
└── api/
    ├── dns-scan/
    │   └── route.ts    # POST /api/dns-scan
    ├── port-scan/
    │   └── route.ts    # POST /api/port-scan
    ├── packet-sniffer/
    │   └── route.ts    # POST /api/packet-sniffer
    └── security-audit/
        └── route.ts    # POST /api/security-audit
```

### Component Architecture

```
components/
├── DnsScanner.tsx      # DNS enumeration tool
├── PortScanner.tsx     # Port scanning tool
├── PacketSniffer.tsx   # Packet capture tool
├── SecurityAudit.tsx   # Security audit tool
└── HelpGuide.tsx       # Help modal component
```

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Input    │────▶│  React Component │────▶│   API Route     │
│   (Browser)     │     │  (Client-side)   │     │  (Server-side)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                        │
                                │                        ▼
                                │               ┌─────────────────┐
                                │               │  Node.js APIs   │
                                │               │  (dns, net, etc)│
                                │               └─────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  UI Update      │◀────│  Stream/JSON    │
                        │  (Real-time)    │     │  Response       │
                        └─────────────────┘     └─────────────────┘
```

---

## Frontend Implementation

### Client Components
All interactive components use the `'use client'` directive for client-side rendering:

```typescript
'use client'

import { useState } from 'react'

export default function DnsScanner() {
  const [target, setTarget] = useState('')
  // ...
}
```

### State Management
- **Local State**: React `useState` for component-level state
- **No Global State**: Each tool is self-contained
- **Form State**: Controlled inputs with state binding

### Real-time Streaming
DNS and Port scanners use streaming responses for real-time updates:

```typescript
const response = await fetch('/api/dns-scan', {
  method: 'POST',
  body: JSON.stringify({ target, wordlist })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader!.read()
  if (done) break

  const chunk = decoder.decode(value)
  // Parse and update UI with each chunk
}
```

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Grid layouts adapt from 1 column (mobile) to 2 columns (desktop)
- Touch-friendly button sizes and spacing

---

## Backend Implementation

### API Route Structure
Each API route follows a consistent pattern:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { target, ...options } = await request.json()
    
    // Validate input
    if (!target) {
      return NextResponse.json(
        { error: 'Target required' },
        { status: 400 }
      )
    }
    
    // Process request
    const results = await performScan(target, options)
    
    return NextResponse.json({ success: true, results })
  } catch (error) {
    return NextResponse.json(
      { error: 'Scan failed' },
      { status: 500 }
    )
  }
}
```

### Streaming Responses
For long-running operations, we use `ReadableStream`:

```typescript
const stream = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder()
    
    for (const item of items) {
      // Process item
      const result = await processItem(item)
      
      // Send result to client
      controller.enqueue(
        encoder.encode(JSON.stringify({ type: 'result', result }) + '\n')
      )
    }
    
    controller.close()
  }
})

return new Response(stream, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' }
})
```

### Concurrent Processing
Batch processing for performance optimization:

```typescript
const batchSize = 50
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize)
  await Promise.all(batch.map(item => processItem(item)))
}
```

---

## Styling & Design System

### Color Palette
| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Background | Black | `bg-black` |
| Cards | Zinc 900 | `bg-zinc-900` |
| Borders | Zinc 700/800 | `border-zinc-700` |
| Primary Text | White | `text-white` |
| Secondary Text | Gray 400 | `text-gray-400` |
| Primary Button | White on Black | `bg-white text-black` |

### Custom CSS Classes (globals.css)

```css
.glass-card {
  @apply bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl;
}

.hover-glow {
  @apply hover:shadow-lg hover:shadow-white/10 transition-shadow;
}
```

### Animation
- **Framer Motion** for page transitions and entrance animations
- **Tailwind animations** for loading states (`animate-pulse`, `animate-spin`)
- **CSS transitions** for hover effects

---

## Development Methodology

### 1. Component-Driven Development
- Each feature is a self-contained component
- Components are reusable and testable
- Clear separation between UI and logic

### 2. API-First Design
- Backend APIs designed before frontend integration
- Consistent error handling and response formats
- Input validation on both client and server

### 3. Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced UX with client-side interactivity
- Fallbacks for unsupported features

### 4. Mobile-First Responsive
- Design starts with mobile layout
- Progressive enhancement for larger screens
- Touch-optimized interactions

### 5. Type Safety
- TypeScript for compile-time error checking
- Interface definitions for API responses
- Strict null checking enabled

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration (`vercel.json`):**
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Self-Hosted

```bash
# Build
npm run build

# Start production server
npm start
```

### Environment Variables
No environment variables required for basic functionality.

### Deployment Considerations

| Feature | Vercel | Self-Hosted |
|---------|--------|-------------|
| DNS Scan | ✅ Works | ✅ Works |
| Port Scan | ⚠️ Limited | ✅ Full |
| Packet Sniffer | ❌ Simulated | ⚠️ Needs root |
| Security Audit | ✅ Works | ✅ Works |

---

## Project Structure

```
network-scanner-pro/
├── app/
│   ├── api/
│   │   ├── dns-scan/route.ts
│   │   ├── port-scan/route.ts
│   │   ├── packet-sniffer/route.ts
│   │   └── security-audit/route.ts
│   ├── dashboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DnsScanner.tsx
│   ├── HelpGuide.tsx
│   ├── PacketSniffer.tsx
│   ├── PortScanner.tsx
│   └── SecurityAudit.tsx
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── vercel.json
```

---

## Key Design Decisions

### 1. Next.js App Router
**Why:** Modern React features, built-in API routes, excellent DX, easy deployment.

### 2. TypeScript
**Why:** Type safety, better IDE support, catch errors at compile time.

### 3. Tailwind CSS
**Why:** Rapid prototyping, consistent design, small bundle size.

### 4. Streaming Responses
**Why:** Better UX for long-running scans, real-time progress updates.

### 5. Serverless Architecture
**Why:** Easy scaling, no server management, cost-effective for variable traffic.

### 6. Simulated Packet Capture
**Why:** Real packet capture requires system-level access not available in browsers or serverless environments.

---

## Performance Optimizations

1. **Batch Processing**: Scans processed in batches to prevent overwhelming
2. **Streaming**: Results sent as they're found, not after scan completes
3. **Client Components**: Only interactive parts use client-side rendering
4. **Minimal Dependencies**: Only essential packages included
5. **Tailwind Purging**: Unused CSS removed in production build

---

## Future Improvements

- [ ] Add authentication for scan history
- [ ] Implement WebSocket for real-time updates
- [ ] Add scan scheduling and automation
- [ ] Create exportable PDF reports
- [ ] Add vulnerability database integration
- [ ] Implement scan rate limiting
- [ ] Add dark/light theme toggle
