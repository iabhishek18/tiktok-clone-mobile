# TikTok Clone — Short Video Platform

> Complete short-video platform with video upload/processing (FFmpeg), infinite scroll feed, likes/comments, follow system, and trending algorithm.

## 🚀 Overview

A full TikTok clone featuring video recording and upload with server-side FFmpeg processing (1080x1920 optimization), infinite scroll feed with auto-play, social features (like, comment, share, follow), hashtag discovery, and trending content algorithm based on views and engagement velocity.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📹 Video Upload | Upload with FFmpeg transcoding (1080x1920) |
| 📱 Infinite Scroll | Auto-playing vertical video feed |
| ❤️ Engagement | Like, comment, share with counts |
| 👤 Profiles | Follow/unfollow, video grid, stats |
| 🔥 Trending | Algorithm based on views + engagement rate |
| #️⃣ Hashtags | Tag videos, browse by hashtag |
| 🎵 Song Attribution | Attach songs to videos |
| ☁️ S3 Storage | Video + thumbnail storage on AWS |
| 🖼️ Auto Thumbnails | FFmpeg-generated preview frames |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo, expo-av |
| Backend | Node.js, Express, MongoDB |
| Video | FFmpeg (fluent-ffmpeg) |
| Storage | AWS S3 |
| Auth | JWT + bcrypt |

## ⚡ Quick Start

```bash
# Backend
cd server && npm install && cp ../.env.example .env && npm run dev

# Mobile
cd mobile && npm install && expo start
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing key |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `S3_BUCKET` | S3 bucket for videos |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/feed` | Paginated feed |
| POST | `/api/videos` | Upload video |
| POST | `/api/videos/:id/like` | Toggle like |
| POST | `/api/videos/:id/comment` | Add comment |
| GET | `/api/videos/trending` | Trending videos |
| GET | `/api/users/:username` | User profile |
| POST | `/api/users/:id/follow` | Follow/unfollow |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |

## 📄 License

MIT
