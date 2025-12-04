import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Cloudinary directly in the script
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dsj8rtjjn',
  api_key: process.env.CLOUDINARY_API_KEY || '253589412571832',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZYaa-U4XHdKm31FG_DQtMAqq27Q',
});

const VIDEOS_TO_MIGRATE = [
  {
    url: 'https://w5mjyhicrod4w1t5.public.blob.vercel-storage.com/background-video.mp4',
    publicId: 'teensrave/videos/background-video',
    displayName: 'Background Video'
  },
  {
    url: 'https://w5mjyhicrod4w1t5.public.blob.vercel-storage.com/TR24_5TH%20DIMENSION.mp4',
    publicId: 'teensrave/videos/tr24-5th-dimension',
    displayName: 'TR24 5th Dimension Video'
  }
];

async function uploadVideoToCloudinary(videoUrl: string, publicId: string, displayName: string) {
  try {
    console.log(`\n📤 Uploading ${displayName}...`);
    console.log(`   Source: ${videoUrl}`);
    console.log(`   Public ID: ${publicId}`);
    
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      public_id: publicId,
      folder: 'teensrave/videos',
      overwrite: true,
      invalidate: true,
    });

    console.log(`✅ Successfully uploaded ${displayName}`);
    console.log(`   Cloudinary URL: ${result.secure_url}`);
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Size: ${(result.bytes / 1024 / 1024).toFixed(2)} MB`);
    
    return result;
  } catch (error) {
    console.error(`❌ Error uploading ${displayName}:`, error);
    throw error;
  }
}

async function migrateVideos() {
  console.log('🚀 Starting video migration from Vercel Blob to Cloudinary...\n');
  console.log(`📊 Total videos to migrate: ${VIDEOS_TO_MIGRATE.length}\n`);
  
  const results = [];
  
  for (const video of VIDEOS_TO_MIGRATE) {
    try {
      const result = await uploadVideoToCloudinary(
        video.url,
        video.publicId,
        video.displayName
      );
      results.push({ success: true, video: video.displayName, result });
    } catch (error) {
      results.push({ success: false, video: video.displayName, error });
    }
  }
  
  console.log('\n\n📋 Migration Summary:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${VIDEOS_TO_MIGRATE.length}`);
  console.log(`❌ Failed: ${failed.length}/${VIDEOS_TO_MIGRATE.length}\n`);
  
  if (successful.length > 0) {
    console.log('Uploaded Videos:');
    successful.forEach((r: any) => {
      console.log(`  • ${r.video}: ${r.result.secure_url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nFailed Videos:');
    failed.forEach((r: any) => {
      console.log(`  • ${r.video}: ${r.error.message}`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🎉 Migration completed!\n');
}

// Run the migration
migrateVideos()
  .then(() => {
    console.log('✨ All done! You can now update your component files with the new Cloudinary URLs.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
