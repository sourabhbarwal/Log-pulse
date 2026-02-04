# LogPulse 🚀🛰️

**Real-time Distributed Log Monitoring & Analytics Platform.**

LogPulse is a high-performance, open-source logging infrastructure designed to aggregate, visualize, and analyze logs from a distributed fleet of servers in real-time. Built with a focus on speed, aesthetics, and developer experience.

![Dashboard Preview](public/dashboard_preview.png)

## ✨ Features

- **Distributed Ingestion**: Multi-node support with per-server API key management.
- **Real-time Pulse**: Sub-second log streaming powered by Redis and Socket.io.
- **Micro-Visualizations**: Time-series trend charts and real-time KPI tracking.
- **Smart Fingerprinting**: Automatically groups similar logs to reduce alert fatigue.
- **Enterprise Security**: Role-based access control (RBAC), GitHub/Google OAuth, and rate limiting.
- **Global Search**: High-speed historical log retrieval across your entire fleet.
- **Developer First**: One-click exports (CSV/JSON), dark mode, and a mobile-responsive dashboard.

## 🛠️ Tech Stack

- **Kernel**: Next.js 15 (App Router)
- **Pulse**: Redis Pub/Sub + Socket.io
- **Persistence**: MongoDB (Mongoose)
- **Identity**: NextAuth.js (Auth.js v5)
- **Visuals**: Tailwind CSS + Framer Motion + Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/sourabhbarwal/Log-pulse.git
cd log-pulse
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
MONGODB_URI=your_mongo_uri
REDIS_URL=your_redis_url
AUTH_SECRET=your_auth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional OAuth
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

### 3. Running for Development

```bash
npm run dev:socket
```

## 🛰️ Connecting Your Fleet

1. Navigate to the **Server Fleet** tab.
2. Create a new server node (e.g., "Auth-API").
3. Copy the generated `lp_...` API Key.
4. Send your first log:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/logs/ingest" `
  -Method Post `
  -Headers @{"x-api-key"="lp_your_key"} `
  -ContentType "application/json" `
  -Body '{"level": "ERROR", "message": "Connection timeout"}'
```

## 📜 Logging Standards

To get the most out of LogPulse, use the following log structure:

| Field     | Type   | Description                             |
| :-------- | :----- | :-------------------------------------- |
| `level`   | String | `INFO`, `WARN`, or `ERROR` (Required)   |
| `message` | String | The main log message (Required)         |
| `details` | Object | Arbitrary JSON for debugging (Optional) |

Example:

```json
{
  "level": "ERROR",
  "message": "Database write failed",
  "details": {
    "collection": "users",
    "retries": 3,
    "error_code": 11000
  }
}
```

## 📄 License

MIT License - Copyright (c) 2026 Sourabh Barwal
