import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImage(
  file: Buffer | string,
  folder: string = 'tetouanluxury'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file.toString('base64'), {
      folder,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

export async function getImageUrl(publicId: string, transformation?: any): Promise<string> {
  return cloudinary.url(publicId, {
    transformation,
    secure: true,
  });
}

export { cloudinary };
