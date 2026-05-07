import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authRoutes = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tiktok-secret';

authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, displayName } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed, displayName });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ success: true, data: { user: { id: user._id, username, displayName, avatar: '' }, token } });
  } catch (err) { res.status(500).json({ error: 'Registration failed' }); }
});

authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, data: { user: { id: user._id, username: user.username, displayName: user.displayName, avatar: user.avatar }, token } });
  } catch (err) { res.status(500).json({ error: 'Login failed' }); }
});
