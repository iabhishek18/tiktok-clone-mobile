import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Video } from '../models/Video';

export const userRoutes = Router();

userRoutes.get('/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const videoCount = await Video.countDocuments({ user: user._id });
    res.json({ success: true, data: { ...user.toObject(), videoCount, followerCount: user.followers.length, followingCount: user.following.length } });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch user' }); }
});

userRoutes.post('/:id/follow', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    const isFollowing = targetUser.followers.includes(userId);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { following: req.params.id } });
    } else {
      await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { following: req.params.id } });
    }
    res.json({ success: true, following: !isFollowing });
  } catch (err) { res.status(500).json({ error: 'Failed to follow/unfollow' }); }
});

userRoutes.get('/:id/videos', async (req: Request, res: Response) => {
  const videos = await Video.find({ user: req.params.id, isPublic: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: videos });
});
