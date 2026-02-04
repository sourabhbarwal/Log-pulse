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

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Node ID and status are required" }, { status: 400 });
    }

    await dbConnect();
    const node = await Node.findOneAndUpdate(
      { _id: id, owner: session.user?.email },
      { status },
      { new: true }
    );

    if (!node) {
      return NextResponse.json({ error: "Node not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(node);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Node ID is required" }, { status: 400 });
    }

    await dbConnect();
    const node = await Node.findOneAndDelete({ _id: id, owner: session.user?.email });

    if (!node) {
      return NextResponse.json({ error: "Node not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete node" }, { status: 500 });
  }
}
