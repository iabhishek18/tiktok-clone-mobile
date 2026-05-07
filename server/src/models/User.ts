import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: string[];
  following: string[];
  totalLikes: number;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 80 },
  followers: [{ type: String, ref: 'User' }],
  following: [{ type: String, ref: 'User' }],
  totalLikes: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
