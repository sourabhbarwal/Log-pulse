# ✅ LogPulse Deep Verification Guide

Follow this detailed protocol to verify every layer of your LogPulse infrastructure.

---

## 1. Phase A: Infrastructure Vital Signs 🏥

**Objective**: Ensure the backend services are communicating correctly.

- [ ] **Action**: Open your browser and navigate to `<your-url>/api/health`.
- [ ] **Verification**: You must see the following JSON structure:
  ```json
  {
    "status": "healthy",
    "mongodb": "connected",
    "redis": "connected",
    "socketServer": "up"
  }
  ```

---

## 2. Phase B: Real-time Ingestion Pipeline ⚡

**Objective**: Verify the sub-second log streaming from an external source to the dashboard.

- [ ] **Step 1: Get your API Key**
  - Navigate to the **Server Fleet** page.
  - Create a node (e.g., "Verification-Node").
  - Copy the generated API Key (`lp_...`).

- [ ] **Step 2: Trigger a Test Log**
      Choose one of the methods below and execute it in your terminal.

  ### Option 1: cURL (Linux/Mac/Git Bash)

  ```bash
  curl -X POST http://localhost:3000/api/logs/ingest \
    -H "Content-Type: application/json" \
    -H "x-api-key: YOUR_COPIED_KEY" \
    -d '{
      "level": "ERROR",
      "message": "Verification Test: Pipeline Healthy",
      "details": { "test_id": "v1-001", "source": "curl" }
    }'
  ```

  ### Option 2: PowerShell (Windows)

  ```powershell
  $headers = @{ "x-api-key" = "YOUR_COPIED_KEY" }
  $body = @{
      level = "INFO"
      message = "Windows PowerShell Verification"
      details = @{ system = "Win11"; status = "verified" }
  } | ConvertTo-Json

  Invoke-RestMethod -Uri "http://localhost:3000/api/logs/ingest" `
    -Method Post -Headers $headers -ContentType "application/json" -Body $body
  ```

  ### Option 3: Node.js (Script)

  ```javascript
  fetch("http://localhost:3000/api/logs/ingest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_COPIED_KEY",
    },
    body: JSON.stringify({
      level: "WARN",
      message: "Node.js Environment Test",
      details: { environment: "production" },
    }),
  }).then((res) => console.log("Status:", res.status));
  ```

- [ ] **Step 3: Observe the Results**
  - **Dashboard**: The log must appear in the "Global Logs" list in under 500ms.
  - **KPI Ribbon**: The "Total Logs" and "Error/Warning" counts must increment instantly.
  - **Pulse Indicator**: The neon pulse wave in the sidebar should animate.

---

## 3. Phase C: Intelligence & Filtering 🧠

**Objective**: Verify Smart Fingerprinting and Search.

- [ ] **Fingerprinting Test**: Execute the **cURL** command above 5 times rapidly.
  - **Expected Result**: Only 1 entry appears in the list, but the "Occurrences" badge shows `5`.
- [ ] **Search Test**: Type "Verification" into the Global Search bar.
  - **Expected Result**: All non-matching logs disappear instantly.

---

## 4. Phase D: Fleet Control 🛰️

**Objective**: Verify manual override of ingestion nodes.

- [ ] **Action**: Go to "Server Fleet", find your node, and toggle the switch to **Paused**.
- [ ] **Action**: Re-run the test cURL command.
- [ ] **Verification**: The terminal should return `401 Unauthorized`. The dashboard should NOT show any new logs.

---

## 5. Phase E: Security & Access �

- [ ] **Action**: Log out of the dashboard.
- [ ] **Action**: Try to access `localhost:3000/nodes`.
- [ ] **Verification**: You should be immediately redirected to the `/login` page (Standard Auth.js Middleware).

---

**Platform Identity Verified.** 🦾🚀�
