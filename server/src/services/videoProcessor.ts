import ffmpeg from 'fluent-ffmpeg';
import { S3 } from 'aws-sdk';
import path from 'path';
import fs from 'fs';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
});

export async function processVideo(inputPath: string, videoId: string): Promise<{ videoUrl: string; thumbnailUrl: string; duration: number }> {
  const outputDir = `/tmp/videos/${videoId}`;
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'output.mp4');
  const thumbPath = path.join(outputDir, 'thumb.jpg');

  const duration = await getVideoDuration(inputPath);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(['-c:v libx264', '-crf 23', '-preset fast', '-c:a aac', '-movflags +faststart', '-vf scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2'])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({ timestamps: ['00:00:01'], filename: 'thumb.jpg', folder: outputDir, size: '540x960' })
      .on('end', resolve)
      .on('error', reject);
  });

  const videoUrl = await uploadToS3(outputPath, `videos/${videoId}/video.mp4`, 'video/mp4');
  const thumbnailUrl = await uploadToS3(thumbPath, `videos/${videoId}/thumb.jpg`, 'image/jpeg');

  fs.rmSync(outputDir, { recursive: true });
  return { videoUrl, thumbnailUrl, duration };
}

function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(Math.round(metadata.format.duration || 0));
    });
  });
}

async function uploadToS3(filePath: string, key: string, contentType: string): Promise<string> {
  const fileContent = fs.readFileSync(filePath);
  const result = await s3.upload({ Bucket: process.env.S3_BUCKET || 'tiktok-clone-videos', Key: key, Body: fileContent, ContentType: contentType, ACL: 'public-read' }).promise();
  return result.Location;
}
