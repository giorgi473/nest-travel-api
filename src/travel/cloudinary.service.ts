import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.logger.log('✅ Cloudinary configured');
  }

  async uploadImage(
    base64Image: string,
    folder: string = 'sliders',
  ): Promise<string> {
    try {
      this.logger.log('📤 Uploading image to Cloudinary...');

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' }, // Max resolution
          { quality: 'auto:best' }, // Auto quality optimization
          { fetch_format: 'auto' }, // Auto format (WebP support)
        ],
      });

      this.logger.log(`✅ Image uploaded: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      this.logger.error('❌ Cloudinary upload error:', error);
      throw new Error('სურათის ატვირთვა ვერ მოხერხდა');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      const publicId = this.extractPublicId(imageUrl);

      if (!publicId) {
        this.logger.warn('⚠️ Invalid Cloudinary URL, skipping delete');
        return;
      }

      this.logger.log(`🗑️ Deleting image: ${publicId}`);
      await cloudinary.uploader.destroy(publicId);
      this.logger.log('✅ Image deleted from Cloudinary');
    } catch (error) {
      this.logger.error('❌ Cloudinary delete error:', error);
      // Don't throw - image might already be deleted
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/sliders/image.jpg
      const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}
