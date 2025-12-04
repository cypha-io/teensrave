import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const listVideos = async () => {
  try {
    console.log('📋 Listing videos from Cloudinary...\n');
    
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      prefix: 'teensrave',
      max_results: 50,
    });

    console.log(`Found ${result.resources.length} videos:\n`);
    
    result.resources.forEach((resource: any) => {
      console.log(`✅ ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}`);
      console.log(`   Size: ${(resource.bytes / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   Format: ${resource.format}`);
      console.log(`   Created: ${resource.created_at}`);
      console.log('');
    });
    
    return result.resources;
  } catch (error) {
    console.error('Error listing videos:', error);
    return [];
  }
};

listVideos();
