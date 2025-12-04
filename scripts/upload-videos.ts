import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadVideo = async (filePath: string, publicId: string) => {
  try {
    console.log(`\nUploading ${filePath}...`);
    console.log('This may take several minutes for large files...');
    
    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: 'video',
      public_id: publicId,
      folder: 'teensrave',
      overwrite: true,
      chunk_size: 6000000, // 6MB chunks
    });

    console.log(`✅ Successfully uploaded: ${publicId}`);
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Size: ${(result.bytes / 1024 / 1024).toFixed(2)}MB`);
    
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${publicId}:`, error);
    throw error;
  }
};

const main = async () => {
  console.log('🚀 Starting video upload to Cloudinary...\n');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  
  const publicDir = resolve(process.cwd(), 'public');
  
  const videos = [
    {
      path: resolve(publicDir, 'background-video.mp4'),
      publicId: 'background-video',
    },
    {
      path: resolve(publicDir, 'TR24_5TH DIMENSION.mp4'),
      publicId: 'TR24_5TH_DIMENSION',
    },
  ];

  for (const video of videos) {
    await uploadVideo(video.path, video.publicId);
  }

  console.log('\n✨ All videos uploaded successfully!');
};

main().catch((error) => {
  console.error('Upload failed:', error);
  process.exit(1);
});
