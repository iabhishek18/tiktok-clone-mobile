import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  user: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  likes: string[];
  comments: Array<{ user: string; text: string; createdAt: Date }>;
  shares: number;
  views: number;
  hashtags: string[];
  song: { name: string; artist: string; coverUrl?: string };
  isPublic: boolean;
}

const videoSchema = new Schema<IVideo>({
  user: { type: String, ref: 'User', required: true, index: true },
  caption: { type: String, maxlength: 2200 },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  likes: [{ type: String, ref: 'User' }],
  comments: [{ user: { type: String, ref: 'User' }, text: String, createdAt: { type: Date, default: Date.now } }],
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  hashtags: [String],
  song: { name: String, artist: String, coverUrl: String },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

videoSchema.index({ createdAt: -1 });
videoSchema.index({ hashtags: 1 });
videoSchema.index({ views: -1 });

export const Video = mongoose.model<IVideo>('Video', videoSchema);
