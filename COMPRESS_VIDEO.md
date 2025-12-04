# Compress Background Video for Cloudinary

## Problem
`background-video.mp4` is 120.05MB, which exceeds Cloudinary's 100MB free tier limit.

## Solution Options

### Option 1: Use ffmpeg (Command Line)
Once ffmpeg finishes installing, run:
```bash
cd /Users/cyphahimself/Desktop/teensrave/public

# Compress video to ~70-80MB while maintaining quality
ffmpeg -i background-video.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k background-video-compressed.mp4

# Check the new file size
ls -lh background-video-compressed.mp4

# If under 100MB, rename it
mv background-video.mp4 background-video-original.mp4
mv background-video-compressed.mp4 background-video.mp4
```

### Option 2: Use Online Tool (Faster - No Install Required)
1. Go to https://www.freeconvert.com/video-compressor
2. Upload `public/background-video.mp4`
3. Set target size to **90MB** (to be safe)
4. Download compressed video
5. Replace `public/background-video.mp4` with the compressed version

### Option 3: Use HandBrake (GUI App)
1. Download HandBrake: https://handbrake.fr/
2. Open background-video.mp4
3. Use preset: "Fast 1080p30"
4. Adjust quality slider to get ~80-90MB file size
5. Export and replace original

## After Compression
Once the video is under 100MB, upload to Cloudinary:
```bash
npm run upload:videos
```

Or manually:
1. Go to https://console.cloudinary.com/
2. Upload to folder: `teensrave`
3. Public ID: `background-video`
4. Update `components/AfrofutureHero.tsx` line 26 with Cloudinary URL
