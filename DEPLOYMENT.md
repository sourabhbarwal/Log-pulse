# LogPulse Deployment Guide 🌍🚀

This guide provides a beginner-friendly, step-by-step process to deploy LogPulse to the cloud.

## 1. Prerequisites

- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account (for the UI/API).
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free database).
- An [Upstash](https://upstash.com) or [Redis Cloud](https://redis.io/cloud/) account (Free Redis).

---

## 2. Setting Up the Database (MongoDB)

1. Create a free cluster on **MongoDB Atlas**.
2. Go to **Network Access** and allow IP address `0.0.0.0/0` (standard for Vercel).
3. Go to **Database Access** and create a user with a password.
4. Click **Connect** -> **Connect your application** and copy the `MONGODB_URI`.

## 3. Setting Up the Heartbeat (Redis)

1. Create a free database on **Upstash**.
2. Copy the **Redis URL** (it should look like `rediss://default:password@host:port`).

## 4. Deploying to Vercel (Frontend & API)

1. Push your code to a GitHub repository.
2. Link the repository to **Vercel**.
3. Add the following **Environment Variables**:
   - `MONGODB_URI`: (From Step 2)
   - `REDIS_URL`: (From Step 3)
   - `AUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g., `https://log-pulse.vercel.app`).
4. Click **Deploy**.

---

## 5. The Socket.io Server (Important ⚠️)

LogPulse uses a custom WebSocket server (`server.ts`). Vercel does **not** support long-running WebSockets.

### Options for the Socket Server:

#### Option A: VPS (DigitalOcean/Linode/AWS) - Best

Run the app using Docker on a small VPS ($5/mo).

```bash
docker-compose up -d --build
```

#### Option B: Dedicated Socket Server (Render/Railway)

1. Deploy the project to **Railway.app**.
2. Set the "Start Command" to `npm run start:socket`.
3. Set your `NEXT_PUBLIC_APP_URL` to point to the Railway URL.

---

## 6. Verification

Once deployed:

1. Access `/api/health`. Verify all services are "connected".
2. Login and verify you can create a Server Node.
3. Test ingestion from your local machine to the production URL.

**Success! Your distributed logging fleet is live.**
