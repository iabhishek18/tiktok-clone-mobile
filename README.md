# TikTok Clone - Short Video Platform

Complete TikTok clone with video recording, infinite scroll feed, likes, comments, and creator features.

## Features
- 📹 Video upload with FFmpeg processing (1080x1920 optimization)
- 📱 Infinite scroll feed with auto-play
- ❤️ Like, comment, share functionality
- 👤 User profiles with follow system
- 🔥 Trending videos algorithm
- 🎵 Sound/song attribution
- #️⃣ Hashtag system
- ☁️ S3 video storage with thumbnails

## Tech Stack
- **Mobile**: React Native, Expo, expo-av
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Video Processing**: FFmpeg (fluent-ffmpeg)
- **Storage**: AWS S3
- **Auth**: JWT + bcrypt

## Getting Started
```bash
cd server && npm install && npm run dev
cd mobile && npm install && expo start
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/videos/feed | Get video feed |
| POST | /api/videos | Upload video |
| POST | /api/videos/:id/like | Like/unlike |
| POST | /api/videos/:id/comment | Add comment |
| GET | /api/videos/trending | Trending videos |
| GET | /api/users/:username | Get profile |
| POST | /api/users/:id/follow | Follow/unfollow |

## License
MIT
