# LogPulse Ingestion & Error Formatting Guide 🛰️📑

This guide explains how to connect your external servers to LogPulse and how to design your log messages for maximum clarity and analytics.

## 1. Authentication

All requests to the LogPulse Ingestion API must include your **Node API Key** in the header.

- **Header Name**: `x-api-key`
- **Example Key**: `lp_abcdef123456789...`

## 2. Ingestion Endpoint

- **URL**: `https://your-domain.com/api/logs/ingest`
- **Method**: `POST`
- **Content-Type**: `application/json`

---

## 3. Designing Your Log Messages

LogPulse uses the data you send to generate analytics, charts, and smart alerts. Following a standard schema is highly recommended.

### Core Fields

| Field     | Type   | Description                                            |
| :-------- | :----- | :----------------------------------------------------- |
| `level`   | String | **Required.** Must be `INFO`, `WARN`, or `ERROR`.      |
| `message` | String | **Required.** The primary description of the event.    |
| `details` | Object | Optional JSON object containing context-specific data. |

### Error Formatting Best Practices

#### ❌ Bad Example (Vague)

```json
{
  "level": "ERROR",
  "message": "It crashed"
}
```

_Why it's bad: No context, hard to troubleshoot, cannot be effectively grouped._

#### ✅ Good Example (Structured)

```json
{
  "level": "ERROR",
  "message": "[AuthService] Token validation failed: Expired",
  "details": {
    "user_id": "usr_9872",
    "token_type": "JWT",
    "requested_scope": "admin",
    "ip_address": "192.168.1.45"
  }
}
```

### Tips for Better Logs:

1. **Source Prefixing**: Use `[Service-Name]` at the start of messages for quick visual scanning.
2. **Contextual JSON**: If an error happens during a payment, include the `transaction_id` and `currency` in the `details` object.
3. **Consistency**: Use consistent naming for keys in the `details` object (e.g., always use `user_id` instead of switching between `userId`, `u_id`, etc.).

---

## 4. Troubleshooting Ingestion

- **401 Unauthorized**: Your API Key is invalid or the Server Node has been "Paused" in the dashboard.
- **400 Bad Request**: Malformed JSON or missing required fields (`level`, `message`).
- **500 Internal Error**: Check your LogPulse server logs (or DB connection).

**Ready to start? Visit the Server Fleet page to generate your first key.**
