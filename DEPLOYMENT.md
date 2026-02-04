# 🚀 Ultimate Beginner's Deployment Guide: LogPulse

Welcome! If you've never deployed a website before, this guide is for you. We will take your local LogPulse project and put it on the internet for the world to see.

---

## 🗺️ The Roadmap

1. **GitHub**: Uploading your code safely.
2. **MongoDB Atlas**: Setting up your permanent database.
3. **Upstash**: Setting up your real-time log "heartbeat".
4. **Railway**: Hosting the application (Best for WebSockets).

---

## 📦 Step 1: Upload Code to GitHub

_Think of GitHub as a safe cloud-folder for your code._

1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **"+"** icon in the top right -> **New Repository**.
3. Name it `log-pulse`. Keep it **Private** if you wish.
4. Open your terminal in VS Code and run:
   ```bash
   git add .
   git commit -m "Final production push"
   git push origin main
   ```
   _(If you've already pushed to your branch, skip this!)_

---

## 🍃 Step 2: Set Up your Database (MongoDB Atlas)

_This is where your logs and users are stored forever._

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/general/tryfree).
2. **Create a Cluster**: Choose the **FREE M0** shared tier. Pick a region near you.
3. **Security (Important!)**:
   - Go to **Database Access** (Left Sidebar). Create a user. Choose a simple username and password. **Write them down.**
   - Go to **Network Access** (Left Sidebar). Click **Add IP Address**. Click **"Allow Access from Anywhere"**. This ensures your hosted app can talk to the database.
4. **Get Connection String**:
   - Click **Database** -> **Connect** (on your cluster).
   - Choose **"Drivers"**.
   - Copy the string. It looks like: `mongodb+srv://<db_username>:<db_password>@cluster.mongodb.net/?...`
   - **Replace** `<db_username>` and `<db_password>` with the ones you created in step 3.

---

## 🚩 Step 3: Set Up the Real-time Heartbeat (Upstash Redis)

_This handles the "instant" part of LogPulse._

1. Sign up at [Upstash](https://upstash.com).
2. Click **Create Database**.
3. Name it `logpulse-redis` and pick a region near you.
4. Scroll down to the **Connect** section and copy the **Redis URL**.
   - It looks like: `rediss://default:password@host:port`.
   - **Important**: Use the URL format, not the Node.js connection code.

---

## 🚂 Step 4: Host Your App (Railway.app)

_We use Railway because it supports WebSockets (Socket.io) which are the brain of LogPulse._

1. Go to [Railway.app](https://railway.app) and sign in with your GitHub.
2. Click **"+ New Project"** -> **"Deploy from GitHub repo"**.
3. Select your `log-pulse` repository.
4. Click **"Add Variables"** and paste the following (One by one):
   - `MONGODB_URI`: (Copy-Paste from Step 2)
   - `REDIS_URL`: (Copy-Paste from Step 3)
   - `AUTH_SECRET`: Go to [this site](https://generate-secret.vercel.app/32) and copy the random string.
   - `NEXT_PUBLIC_APP_URL`: Leave this blank for now.
   - `NODE_ENV`: `production`
5. **Set the Start Command**:
   - Go to **Settings** in your Railway project -> **Deployments**.
   - Find **"Start Command"** and set it to: `npm run start:socket`
6. **Wait for Deployment**: Railway will build your app. Once green, it will give you a domain (e.g., `log-pulse-production.up.railway.app`).
7. **Final Fix**: Copy that URL, go back to your Railway **Variables**, and update `NEXT_PUBLIC_APP_URL` with it.

---

## ✅ Step 5: Verify Your Success!

1. Open your new Railway URL.
2. Navigate to `/api/health`. If you see `{"mongodb": "connected", "redis": "connected"}`, you are a **Deploying Legend**.
3. Log in, create a node, and try sending a log from your local computer to your production URL!

---

## 🛠️ Frequently Asked Questions

**Q: Why not Vercel?**
Vercel is great for simple sites, but LogPulse uses **Socket.io** which needs a "living" server. Railway keeps that server alive 24/7.

**Q: My logs are delayed!**
Ensure your Upstash Redis region is the SAME as your Railway region. Distance causes delay!

**Q: I get "Unauthorized" on login.**
Make sure your `AUTH_SECRET` is set and you've added the Railway URL to your Google/GitHub OAuth authorized redirect URIs if you are using them.
