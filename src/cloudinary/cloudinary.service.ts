import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  /**
   * ატვირთავს სურათს Cloudinary-ზე
   */
  async uploadImage(
    base64String: string,
    folder: string = 'sliders',
  ): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
  }> {
    try {
      this.logger.log('🚀 Starting upload to Cloudinary...');

      // Validate base64
      if (!base64String.startsWith('data:image/')) {
        throw new BadRequestException('არასწორი სურათის ფორმატი');
      }

      // Upload to Cloudinary
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64String,
        {
          folder: folder,
          resource_type: 'auto',
          // ავტომატური ოპტიმიზაცია
          transformation: [
            {
              width: 1920,
              height: 1080,
              crop: 'limit', // არ გაზრდის, მხოლოდ შეამცირებს
            },
            {
              quality: 'auto:good', // ავტომატური ხარისხი
              fetch_format: 'auto', // ავტომატური ფორმატი (WebP თუ browser-ი უჭერს მხარს)
            },
          ],
        },
      );

      this.logger.log(`✅ Upload successful: ${result.secure_url}`);
      this.logger.log(`📊 Size: ${(result.bytes / 1024).toFixed(2)} KB`);
      this.logger.log(`📐 Dimensions: ${result.width}x${result.height}`);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      this.logger.error('❌ Cloudinary upload failed:', error);
      throw new BadRequestException(
        'სურათის ატვირთვა ვერ მოხერხდა: ' + error.message,
      );
    }
  }

  /**
   * შლის სურათს Cloudinary-დან
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      this.logger.log(`🗑️ Deleting image: ${publicId}`);

      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        this.logger.log(`✅ Image deleted: ${publicId}`);
      } else {
        this.logger.warn(`⚠️ Delete result: ${result.result}`);
      }
    } catch (error) {
      this.logger.error('❌ Cloudinary delete failed:', error);
      // არ ვაგდებთ error-ს, რადგან სურათი უკვე შეიძლება წაშლილი იყოს
    }
  }

  /**
   * ახალი URL-ს იღებს სხვადასხვა ტრანსფორმაციით
   */
  getTransformedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
    },
  ): string {
    return cloudinary.url(publicId, {
      transformation: [
        {
          width: options.width,
          height: options.height,
          crop: 'limit',
        },
        {
          quality: options.quality || 'auto:good',
          fetch_format: options.format || 'auto',
        },
      ],
    });
  }
}
