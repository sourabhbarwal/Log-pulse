Project Name: LogPulse

Tagline: Distributed Real-Time Log Monitoring & Alerting

Stack: JavaScript (Next.js, Node.js, Socket.io, Redis, MongoDB)

1. Project Goal
To build a centralized dashboard that ingests real-time logs from multiple external sources via Redis, stores them in MongoDB, and pushes critical errors to a web UI via WebSockets without page refreshes.

2. Minimum Viable Product (MVP) Features
Real-time Log Ingestion: Listen to a Redis "Pub/Sub" channel for incoming JSON logs.

Live Dashboard: A scrolling list of logs color-coded by severity (INFO = Green, WARN = Yellow, ERROR = Red).

Instant Alerting: Trigger a "toast" notification or modal immediately when an ERROR level log is detected.

Persistence: Store all logs in MongoDB to allow for basic historical viewing.

Simulation Script: A standalone JS script to generate "fake" traffic for testing.

3. Success Metrics
Latency: Log emission to UI display in less than 500ms.

Scalability: Ability to handle at least 50 logs per second on a local machine. 

Rules to follow : 
1. The guide should be detailed and deeply clean.

2. Te guide should be divided into phases and for every phase , you have to first explain what we are implementing , the exact code file changes and a meaningful git commit to my github repo.

3. after every phase completion , you should perform some verification steps to verify the implementation. if any verification you cannot do , tell me to do it mannually.

