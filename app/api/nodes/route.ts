import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Node from "@/models/Node";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const nodes = await Node.find({ owner: session.user?.email }).sort({ createdAt: -1 });
  return NextResponse.json(nodes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Basic RBAC Check: Only ADMIn/OWNER can add nodes
  const role = (session.user as any).role;
  if (role !== "ADMIN" && role !== "OWNER") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Node name is required" }, { status: 400 });

    await dbConnect();
    const node = await Node.create({
      name,
      apiKey: `lp_${uuidv4().replace(/-/g, '')}`,
      owner: session.user?.email,
      status: "active"
    });

    return NextResponse.json(node);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create node" }, { status: 500 });
  }
}
