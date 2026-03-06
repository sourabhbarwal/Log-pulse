# 🚀 Ultimate Beginner's Deployment Guide: LogPulse

Welcome! If you've never deployed a website before, this guide is for you. We will take your local LogPulse project and put it on the internet for the world to see.

---

## 🗺️ The Roadmap

1. **GitHub**: Uploading your code safely.
2. **MongoDB Atlas**: Setting up your permanent database.
3. **Upstash**: Setting up your real-time log "heartbeat".
4. **Railway**: Hosting the application (Best for WebSockets).
5. **OAuth (Optional)**: Linking Google/GitHub Login.

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
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/log-pulse.git
   git push -u origin main
   ```

---

## 🍃 Step 2: Set Up your Database (MongoDB Atlas)

_This is where your logs and users are stored._

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/general/tryfree).
2. **Create a Cluster**: Choose the **FREE M0** shared tier. Pick a region near you.
3. **Security**:
   - Go to **Database Access** -> **Add New Database User**. Choose "Password" auth.
   - Go to **Network Access** -> **Add IP Address**. Click **"Allow Access from Anywhere"**.
4. **Get Connection String**:
   - Click **Database** -> **Connect** -> **Drivers**.
   - Copy the string. It looks like: `mongodb+srv://<db_username>:<db_password>@cluster.mongodb.net/?...`
   - **Replace** `<db_username>` and `<db_password>` with your user credentials.

---

## 🚩 Step 3: Set Up the Real-time Heartbeat (Upstash Redis)

_This handles the "instant" part of LogPulse._

1. Sign up at [Upstash](https://upstash.com).
2. Click **Create Database**. Name it `logpulse-redis`.
3. Scroll down to the **Connect** section and copy the **Redis URL**.
   - It looks like: `rediss://default:password@host:port`. **Copy the whole thing.**

---

## 🚂 Step 4: Host Your App (Railway.app)

_Railway supports the WebSockets that LogPulse needs to stay "alive"._

1. Go to [Railway.app](https://railway.app) and sign in with GitHub.
2. Click **"+ New Project"** -> **"Deploy from GitHub repo"**. Select `log-pulse`.
3. Click **"Add Variables"** and paste these precisely:
   - `MONGODB_URI`: (From Step 2)
   - `REDIS_URL`: (From Step 3)
   - `AUTH_SECRET`: Generate one [here](https://generate-secret.vercel.app/32).
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_APP_URL`: (Leave blank for now)
4. **Set Start Command**:
   - Go to **Settings** -> **Deployments**.
   - Change **Start Command** to: `npm run start:socket`
5. **Set Domain**:
   - Go to **Settings** -> **Networking** -> **Generate Domain**.
   - Copy the URL (e.g., `https://log-pulse-production.up.railway.app`).
6. **Update URL Variable**: Go back to **Variables** and update `NEXT_PUBLIC_APP_URL` with your new domain.

---

## 🔐 Step 5: (Optional) Google & GitHub Login

_To enable "Sign in with Google/GitHub", you must tell them about your new site._

### For Google:
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create an **OAuth Client ID**.
3. Add your Railway URL to **"Authorized JavaScript Origins"**.
4. Add `<YOUR_URL>/api/auth/callback/google` to **"Authorized redirect URIs"**.
5. Copy `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` to your Railway Variables.

### For GitHub:
1. Go to **Settings** -> **Developer Settings** -> **OAuth Apps** on GitHub.
2. Add your Railway URL to **"Homepage URL"**.
3. Add `<YOUR_URL>/api/auth/callback/github` to **"Authorization callback URL"**.
4. Copy `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` to your Railway Variables.

---

## ✅ Final Verification
1. Visit `<YOUR_URL>/api/health`.
2. If it says `connected` for both, **congratulations!** You are live. 🚀🏆
