// import {
//   Inject,
//   Injectable,
//   Logger,
//   BadRequestException,
// } from '@nestjs/common';
// import { v2 as cloudinary } from 'cloudinary';

// @Injectable()
// export class CloudinaryService {
//   private readonly logger = new Logger(CloudinaryService.name);

//   constructor(@Inject('CLOUDINARY') private cloudinaryConfig: any) {
//     this.logger.log('✅ Cloudinary configured successfully');
//   }

//   async uploadImage(
//     base64Image: string,
//     folder: string = 'tours',
//   ): Promise<{ url: string; publicId: string }> {
//     try {
//       // ✅ Validate base64
//       if (!base64Image || typeof base64Image !== 'string') {
//         throw new BadRequestException('Invalid image format');
//       }

//       // ✅ If it's already a URL (from Cloudinary), return it
//       if (base64Image.startsWith('http')) {
//         this.logger.log('📌 Image is already a URL, skipping upload');
//         return {
//           url: base64Image,
//           publicId: base64Image.split('/').pop()?.split('.')[0] || 'unknown',
//         };
//       }

//       this.logger.log(`📤 Uploading image to folder: ${folder}`);

//       const result = await cloudinary.uploader.upload(base64Image, {
//         folder,
//         resource_type: 'auto',
//         quality: 'auto',
//         fetch_format: 'auto',
//         timeout: 60000, // 60 seconds
//       });

//       this.logger.log(`✅ Image uploaded successfully: ${result.public_id}`);

//       return {
//         url: result.secure_url,
//         publicId: result.public_id,
//       };
//     } catch (error) {
//       this.logger.error('❌ Cloudinary upload failed:', error.message);
//       throw new BadRequestException(
//         `Cloudinary upload failed: ${error.message}`,
//       );
//     }
//   }

//   async deleteImage(publicId: string): Promise<{ result: string }> {
//     try {
//       if (!publicId) {
//         throw new BadRequestException('Public ID is required');
//       }

//       this.logger.log(`🗑️ Deleting image: ${publicId}`);

//       const result = await cloudinary.uploader.destroy(publicId);

//       this.logger.log(`✅ Image deleted successfully`);

//       return result;
//     } catch (error) {
//       this.logger.error('❌ Cloudinary delete failed:', error.message);
//       throw new BadRequestException(
//         `Cloudinary delete failed: ${error.message}`,
//       );
//     }
//   }

//   async deleteMultipleImages(publicIds: string[]): Promise<void> {
//     try {
//       for (const publicId of publicIds) {
//         await this.deleteImage(publicId);
//       }
//     } catch (error) {
//       this.logger.error('❌ Batch delete failed:', error.message);
//       throw error;
//     }
//   }
// }
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.logger.log('✅ Cloudinary configured successfully');
  }

  async uploadImage(base64: string, folder: string) {
    try {
      this.logger.log(`📤 Uploading image to folder: ${folder}`);

      // თუ base64 უკვე data:image/jpeg;base64, ჩძე ის
      const imageData = base64.startsWith('data:')
        ? base64
        : `data:image/jpeg;base64,${base64}`;

      const result = await cloudinary.uploader.upload(imageData, {
        folder,
        resource_type: 'auto',
      });

      this.logger.log(`✅ Image uploaded successfully: ${result.public_id}`);

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      this.logger.error(`❌ Cloudinary upload failed: ${error.message}`);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async deleteImage(publicId: string) {
    try {
      this.logger.log(`🗑️ Deleting image: ${publicId}`);

      await cloudinary.uploader.destroy(publicId);

      this.logger.log(`✅ Image deleted successfully`);
    } catch (error) {
      this.logger.error(`❌ Cloudinary delete failed: ${error.message}`);
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }
}
