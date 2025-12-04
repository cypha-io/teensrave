# Cloudinary Video Migration Guide

## Step 1: Upload Videos to Cloudinary

You need to manually upload these videos to your Cloudinary account:

### Videos to Upload:
1. **Background Video**
   - Current URL: https://w5mjyhicrod4w1t5.public.blob.vercel-storage.com/background-video.mp4
   - Suggested Cloudinary public_id: `teensrave/videos/background-video`

2. **TR24 5th Dimension Video**
   - Current URL: https://w5mjyhicrod4w1t5.public.blob.vercel-storage.com/TR24_5TH%20DIMENSION.mp4
   - Suggested Cloudinary public_id: `teensrave/videos/tr24-5th-dimension`

### Upload Instructions:

#### Option 1: Using Cloudinary Dashboard (Recommended for large files)
1. Go to https://cloudinary.com/console
2. Log in with your account (dsj8rtjjn)
3. Click on "Media Library"
4. Create a folder structure: `teensrave/videos/`
5. Click "Upload" and select the video files
6. Alternatively, paste the Vercel Blob URLs to upload directly from URL

#### Option 2: Using Cloudinary Upload Widget
1. Download the videos from the Vercel Blob URLs first
2. Upload them to Cloudinary using the dashboard

#### Option 3: Using CLI (if you have cloudinary CLI installed)
```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Configure
cloudinary config:set cloud_name=dsj8rtjjn api_key=253589412571832 api_secret=ZYaa-U4XHdKm31FG_DQtMAqq27Q

# Upload videos
cloudinary uploader upload "URL_HERE" --public-id teensrave/videos/background-video --resource-type video
cloudinary uploader upload "URL_HERE" --public-id teensrave/videos/tr24-5th-dimension --resource-type video
```

## Step 2: Get Cloudinary URLs

After uploading, your videos will be available at:
- Background: `https://res.cloudinary.com/dsj8rtjjn/video/upload/teensrave/videos/background-video.mp4`
- TR24 5th Dimension: `https://res.cloudinary.com/dsj8rtjjn/video/upload/teensrave/videos/tr24-5th-dimension.mp4`

## Step 3: Component Files Updated

The following component files have been updated to use Cloudinary URLs:
- `components/AfrofutureHero.tsx`
- `components/ImageFadeSection.tsx`

## Step 4: Environment Variables

Cloudinary credentials have been added to `.env`:
```
CLOUDINARY_CLOUD_NAME="dsj8rtjjn"
CLOUDINARY_API_KEY="253589412571832"
CLOUDINARY_API_SECRET="ZYaa-U4XHdKm31FG_DQtMAqq27Q"
```

## Step 5: Benefits of Cloudinary

✅ **No storage limits** (unlike Vercel Blob)
✅ **Automatic video optimization**
✅ **Adaptive bitrate streaming**
✅ **CDN delivery worldwide**
✅ **Automatic format conversion** (WebM, MP4, etc.)
✅ **Video transformations** (crop, resize, effects)

## Troubleshooting

If videos don't play after migration:
1. Verify the public_id matches in Cloudinary dashboard
2. Check that the video is in "Active" status
3. Ensure the URLs in components match your Cloudinary account
4. Test the URL directly in browser: `https://res.cloudinary.com/dsj8rtjjn/video/upload/teensrave/videos/background-video.mp4`
