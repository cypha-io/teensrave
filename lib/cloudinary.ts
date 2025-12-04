import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to get Cloudinary video URL
export const getCloudinaryVideoUrl = (publicId: string, options?: {
  quality?: string;
  format?: string;
  transformation?: string;
}) => {
  const { quality = 'auto', format = 'mp4' } = options || {};
  
  return cloudinary.url(publicId, {
    resource_type: 'video',
    quality,
    format,
    secure: true,
  });
};

// Helper function to get Cloudinary image URL
export const getCloudinaryImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
}) => {
  const { 
    width, 
    height, 
    crop = 'fill', 
    quality = 'auto', 
    format = 'auto' 
  } = options || {};
  
  return cloudinary.url(publicId, {
    resource_type: 'image',
    width,
    height,
    crop,
    quality,
    format,
    secure: true,
  });
};
