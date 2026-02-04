import mongoose, { Schema, Document } from "mongoose";

export interface INode extends Document {
  name: string;
  apiKey: string;
  owner: string; // User ID or email for now
  status: "active" | "paused";
  lastIngestAt?: Date;
  createdAt: Date;
}

const NodeSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  apiKey: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  status: { type: String, enum: ["active", "paused"], default: "active" },
  lastIngestAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Node || mongoose.model<INode>("Node", NodeSchema);
