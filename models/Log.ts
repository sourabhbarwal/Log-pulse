import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  source?: string;
  metadata?: Record<string, any>;
  owner: string; // User ID or email
}

const LogSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], required: true, index: true },
  message: { type: String, required: true },
  source: { type: String },
  metadata: { type: Schema.Types.Mixed },
  fingerprint: { type: String, index: true },
  owner: { type: String, required: true, index: true },
});

// Create a text index for full-text search
LogSchema.index({ message: 'text', source: 'text' });

// Ensure the model isn't compiled multiple times in development
const Log: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
