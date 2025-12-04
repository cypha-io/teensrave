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

const uploadBackgroundVideo = async () => {
  const publicDir = resolve(process.cwd(), 'public');
  const filePath = resolve(publicDir, 'background-video.mp4');
  
  try {
    console.log('🚀 Uploading background-video.mp4...\n');
    console.log('This may take several minutes (file is 120MB)...\n');
    
    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: 'video',
      public_id: 'background-video',
      folder: 'teensrave',
      overwrite: true,
      chunk_size: 6000000, // 6MB chunks
    });

    console.log('✅ Successfully uploaded!');
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Public ID: ${result.public_id}`);
    
  } catch (error) {
    console.error('❌ Error uploading:', error);
    process.exit(1);
  }
};

uploadBackgroundVideo();
