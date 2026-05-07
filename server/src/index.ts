import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { videoRoutes } from './routes/video';
import { userRoutes } from './routes/user';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiktok-clone')
  .then(() => { app.listen(PORT, () => console.log(`[TikTok API] Port ${PORT}`)); })
  .catch((err) => { console.error('[Fatal] MongoDB connection failed:', err); process.exit(1); });
