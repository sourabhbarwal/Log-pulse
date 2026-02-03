import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: "ADMIN";
  provider: "credentials" | "google" | "github";
  password?: string; // Only for credentials
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ["ADMIN"], default: "ADMIN" },
  provider: { type: String, enum: ["credentials", "google", "github"], required: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
