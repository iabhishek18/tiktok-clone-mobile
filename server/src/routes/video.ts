import { Router, Request, Response } from 'express';
import { Video } from '../models/Video';

export const videoRoutes = Router();

videoRoutes.get('/feed', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const videos = await Video.find({ isPublic: true })
      .sort({ createdAt: -1, views: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username displayName avatar isVerified');
    res.json({ success: true, data: videos });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch feed' }); }
});

videoRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, caption, videoUrl, thumbnailUrl, duration, hashtags, song } = req.body;
    const video = await Video.create({ user: userId, caption, videoUrl, thumbnailUrl, duration, hashtags, song });
    res.status(201).json({ success: true, data: video });
  } catch (err) { res.status(500).json({ error: 'Failed to upload video' }); }
});

videoRoutes.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    const isLiked = video.likes.includes(userId);
    if (isLiked) {
      video.likes = video.likes.filter(id => id !== userId);
    } else {
      video.likes.push(userId);
    }
    await video.save();
    res.json({ success: true, liked: !isLiked, likes: video.likes.length });
  } catch (err) { res.status(500).json({ error: 'Failed to like video' }); }
});

videoRoutes.post('/:id/comment', async (req: Request, res: Response) => {
  try {
    const { userId, text } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: userId, text } } },
      { new: true }
    );
    res.json({ success: true, data: video?.comments });
  } catch (err) { res.status(500).json({ error: 'Failed to add comment' }); }
});

videoRoutes.post('/:id/view', async (req: Request, res: Response) => {
  await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ success: true });
});

videoRoutes.get('/trending', async (_req: Request, res: Response) => {
  const videos = await Video.find({ isPublic: true })
    .sort({ views: -1, likes: -1 })
    .limit(20)
    .populate('user', 'username displayName avatar');
  res.json({ success: true, data: videos });
});
