import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Node from "@/models/Node";
import Log from "@/models/Log";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is required" }, { status: 401 });
    }

    await dbConnect();
    
    // Validate Node
    const node = await Node.findOne({ apiKey, status: "active" });
    if (!node) {
      return NextResponse.json({ error: "Invalid or inactive API Key" }, { status: 401 });
    }

    const body = await req.json();
    const { level, message, details } = body;

    if (!level || !message) {
      return NextResponse.json({ error: "Level and message are required" }, { status: 400 });
    }

    const logEntry = {
      level,
      message,
      source: node.name,
      timestamp: new Date().toISOString(),
      details: details || {}
    };

    // 1. Persist to MongoDB
    await Log.create(logEntry);

    // 2. Publish to Redis for real-time stream
    if (redis) {
      await redis.publish("log-stream", JSON.stringify(logEntry));
    }

    // 3. Update Node's last ingestion time
    await Node.updateOne({ _id: node._id }, { lastIngestAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
