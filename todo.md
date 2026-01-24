# LogPulse Implementation Todo List

This document outlines the step-by-step implementation of LogPulse, a real-time log monitoring and alerting system.

---

## Phase 1: Project Foundation & Infrastructure

**Goal:** Initialize the tech stack and establish core design tokens.

### Steps:

1. **Initialize Next.js 15 App:**
   - Run `npx create-next-app@latest ./` with App Router, Tailwind CSS, and TypeScript.
   - Clean up default boilerplate code.
2. **Setup Design System (BioTech Direction):**
   - Configure `tailwind.config.ts` with the palette:
     - Background: `#F1F3F3`
     - Foreground/Text: `#616164`
     - Primary: `#A09C5E`
     - Deep Accent: `#4A4A2C`
     - Border: `#B4B4B4`
   - Install Lucide React for icons.
3. **Install Shadcn/ui Components:**
   - Initialize Shadcn/ui: `npx shadcn-ui@latest init`
   - Add required components: `Card`, `Button`, `Badge`, `ScrollArea`, `Toast`.
4. **Environment Configuration:**
   - Create `.env.local` with `MONGODB_URI` and `REDIS_URL`.

**File Changes:**

- `package.json`: Dependencies (Socket.io, Mongoose, Redis, Shadcn).
- `tailwind.config.ts`: Custom color palette.
- `app/layout.tsx`: Root layout with Inter font.

**Git Commit:** `feat: initial project setup with biotech design tokens and shadcn/ui`

**Verification:**

- Run `npm run dev` and ensure the app loads with the custom background color.
- Check if Shadcn components are working.

---

## Phase 2: Log Ingestion Service (Redis Pub/Sub)

**Goal:** Create a backend mechanism to listen for incoming logs.

### Steps:

1. **Setup Redis Client:**
   - Create `lib/redis.ts` to manage Redis connection.
2. **Define Log Schema:**
   - Create `models/Log.ts` using Mongoose: `{ timestamp, level (INFO/WARN/ERROR), message, source, metadata }`.
3. **Implement Log Listener:**
   - Create a background worker or a Next.js API route (or custom server) to listen to a Redis channel `log-stream`.

**File Changes:**

- `lib/redis.ts` [NEW]
- `models/Log.ts` [NEW]
- `lib/logListener.ts` [NEW]

**Git Commit:** `feat: setup redis log listener and mongodb log schema`

**Verification:**

- Use a Redis CLI to publish a test message: `PUBLISH log-stream '{"level":"INFO","message":"Test log"}'`.
- Verify the listener receives the message.

---

## Phase 3: Real-Time Communication (Socket.io)

**Goal:** Push ingested logs from the server to the browser UI.

### Steps:

1. **Socket.io Server Integration:**
   - Setup a Socket.io server (using a custom Next.js server or API route workaround for WebSockets).
2. **Broadcast Logic:**
   - Update the Log Listener to emit a `new-log` event to all connected socket clients.
3. **Socket.io Client Hook:**
   - Create `hooks/useSocket.ts` to handle client-side connection.

**File Changes:**

- `server.ts` (if custom server) or `pages/api/socket.io` [NEW]
- `hooks/useSocket.ts` [NEW]

**Git Commit:** `feat: integrate socket.io for real-time log broadcasting`

**Verification:**

- Check browser console for "Socket connected" message.
- Verify message reception in the UI when a log is published to Redis.

---

## Phase 4: Persistence Layer

**Goal:** Store all logs in MongoDB for historical viewing.

### Steps:

1. **MongoDB Connection:**
   - Create `lib/mongodb.ts` for database connection management.
2. **Save Log on Ingestion:**
   - Update the Log Listener to save every incoming JSON log to MongoDB.

**File Changes:**

- `lib/mongodb.ts` [NEW]
- `lib/logListener.ts` [MODIFY]

**Git Commit:** `feat: implement mongodb persistence for log history`

**Verification:**

- Publish test logs to Redis.
- Use MongoDB Compass or shell to verify logs are saved in the database.

---

## Phase 5: Dashboard UI (BioTech Direction)

**Goal:** Build the visual interface for monitoring logs.

### Steps:

1. **Main Layout (Modular Grid):**
   - Create a Navigation Rail (Left) and Header.
   - Implement the KPI Ribbon (Top) for metrics.
2. **Log List Component:**
   - Build a scrolling log feed using Shadcn `ScrollArea`.
   - Apply color coding: `INFO` (Blue-ish/Neutral), `WARN` (Warm Amber), `ERROR` (Soft Red).
3. **KPI Metrics:**
   - Implement real-time counters for Total Logs, Error Rate, and System Health.
4. **Historical View:**
   - Add a basic "Archive" or "History" view to load logs from MongoDB.

**File Changes:**

- `app/dashboard/page.tsx` [NEW]
- `components/LogList.tsx` [NEW]
- `components/KPICards.tsx` [NEW]

**Git Commit:** `feat: build biotech-inspired dashboard UI with live log feed`

**Verification:**

- Verify layout responsiveness.
- Ensure logs appear in real-time with correct color coding.

---

## Phase 6: Alerting & Notifications

**Goal:** immediate visual feedback for critical errors.

### Steps:

1. **Toast Notification Trigger:**
   - In `useSocket.ts`, trigger a Shadcn `Toast` whenever a log with level `ERROR` is received.
2. **Custom Alert Styles:**
   - Use "Soft Red" tones as per the design doc.

**File Changes:**

- `hooks/useSocket.ts` [MODIFY]
- `components/ui/toast.tsx` [MODIFY Styles if needed]

**Git Commit:** `feat: add real-time toast notifications for error logs`

**Verification:**

- Emit an `ERROR` log via Redis.
- Verify the toast appears instantly on the dashboard.

---

## Phase 7: Simulation Script

**Goal:** Generate "fake" traffic to test system performance.

### Steps:

1. **Traffic Generator Script:**
   - Create `scripts/simulate.js`.
   - Use `redis` client to publish random logs at a configurable interval.
2. **Stress Test:**
   - Verify the system handles 50 logs/sec as per PRD.

**File Changes:**

- `scripts/simulate.js` [NEW]

**Git Commit:** `test: add traffic simulation script for performance testing`

**Verification:**

- Run `node scripts/simulate.js` and monitor dashboard performance and latency.

---

## Phase 8: Final Polish & Metrics Verification

**Goal:** Optimization and meeting success metrics.

### Steps:

1. **Latency Check:**
   - Measure time from Redis publish to UI display (goal < 500ms).
2. **Visual Refinements:**
   - Add subtle micro-animations (Framer Motion) and custom scrollbars.
3. **SEO & Metadata:**
   - Add proper titles and meta descriptions.

**File Changes:**

- `app/layout.tsx` [MODIFY]
- `app/page.tsx` [MODIFY]

**Git Commit:** `chore: final polish and performance optimization`

**Verification:**

- Perform a final walk-through of all features.
- Confirm latency targets are met.
