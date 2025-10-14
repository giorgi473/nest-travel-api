// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Slider } from './entities/slider.entity';
// import { CreateSliderDto } from './dto/create-slider.dto';
// import { UpdateSliderDto } from './dto/update-slider.dto';

// @Injectable()
// export class TravelService {
//   private readonly logger = new Logger(TravelService.name);
//   private readonly MAX_SLIDERS = 4;
//   private readonly ALLOWED_EXTENSIONS = [
//     'jpeg',
//     'png',
//     'jpg',
//     'webp',
//     'svg',
//     'gif',
//   ];

//   constructor(
//     @InjectRepository(Slider)
//     private sliderRepository: Repository<Slider>,
//   ) {}

//   async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
//     this.logger.log('=== 🚀 createSlider START ===');

//     try {
//       // Log incoming data
//       this.logger.log(`📦 DTO received`);
//       this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);
//       this.logger.log(`📦 Src length: ${createSliderDto.src?.length || 0}`);
//       this.logger.log(`📦 Title: ${JSON.stringify(createSliderDto.title)}`);
//       this.logger.log(
//         `📦 Description: ${JSON.stringify(createSliderDto.description)}`,
//       );

//       // Check slider count
//       const count = await this.sliderRepository.count();
//       this.logger.log(`📊 Current sliders: ${count}/${this.MAX_SLIDERS}`);

//       if (count >= this.MAX_SLIDERS) {
//         throw new BadRequestException(
//           `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი`,
//         );
//       }

//       // Validate base64
//       if (
//         !createSliderDto.src ||
//         !createSliderDto.src.startsWith('data:image/')
//       ) {
//         this.logger.error('❌ Invalid base64 format');
//         throw new BadRequestException('სურათის ფორმატი არასწორია');
//       }

//       // Parse base64
//       const matches = createSliderDto.src.match(
//         /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
//       );

//       if (!matches) {
//         this.logger.error(`❌ Regex failed for base64 string`);
//         throw new BadRequestException('Base64 ფორმატი არასწორია');
//       }

//       const [, mimeType, base64Data] = matches;
//       const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

//       this.logger.log(`📝 File type: ${extension}`);

//       if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
//         this.logger.error(`❌ Invalid extension: ${extension}`);
//         throw new BadRequestException(
//           `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
//         );
//       }

//       // For Vercel: Store base64 directly in database (no file system)
//       // This is a temporary solution. For production, use cloud storage (S3, Cloudinary, etc.)

//       this.logger.log('💾 Storing base64 directly in database');

//       // Create slider with base64 data
//       const sliderData = {
//         src: createSliderDto.src, // Store full base64 string
//         title: createSliderDto.title,
//         description: createSliderDto.description,
//       };

//       this.logger.log(`💾 Preparing to save slider`);

//       const slider = this.sliderRepository.create(sliderData);

//       this.logger.log(`✅ Slider entity created`);

//       const savedSlider = await this.sliderRepository.save(slider);

//       this.logger.log(`✅ Slider saved with ID: ${savedSlider.id}`);
//       this.logger.log('=== ✨ createSlider END (SUCCESS) ===');

//       return savedSlider;
//     } catch (error) {
//       this.logger.error('❌ Error in createSlider:', error);

//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }

//       // Log full error for debugging
//       this.logger.error('❌ Full error:', JSON.stringify(error, null, 2));
//       this.logger.error('❌ Error message:', error.message);
//       this.logger.error('❌ Error stack:', error.stack);

//       throw new BadRequestException(
//         'სლაიდერის შენახვა ვერ მოხერხდა: ' + error.message,
//       );
//     }
//   }

//   async findAllSliders(): Promise<Slider[]> {
//     try {
//       return await this.sliderRepository.find({
//         order: { createdAt: 'DESC' },
//       });
//     } catch (error) {
//       this.logger.error('❌ Error in findAllSliders:', error);
//       throw new BadRequestException('სლაიდერების ჩატვირთვა ვერ მოხერხდა');
//     }
//   }

//   async findOneSlider(id: number): Promise<Slider> {
//     try {
//       const slider = await this.sliderRepository.findOne({ where: { id } });
//       if (!slider) {
//         throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
//       }
//       return slider;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       this.logger.error('❌ Error in findOneSlider:', error);
//       throw new BadRequestException('სლაიდერის ჩატვირთვა ვერ მოხერხდა');
//     }
//   }

//   async updateSlider(
//     id: number,
//     updateSliderDto: UpdateSliderDto,
//   ): Promise<Slider> {
//     try {
//       const slider = await this.findOneSlider(id);

//       if (
//         updateSliderDto.src &&
//         updateSliderDto.src.startsWith('data:image/')
//       ) {
//         const matches = updateSliderDto.src.match(
//           /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
//         );

//         if (!matches) {
//           throw new BadRequestException('Base64 ფორმატი არასწორია');
//         }

//         const [, mimeType] = matches;
//         const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

//         if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
//           throw new BadRequestException(
//             `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
//           );
//         }

//         slider.src = updateSliderDto.src;
//       }

//       if (updateSliderDto.title) {
//         slider.title = updateSliderDto.title as any;
//       }
//       if (updateSliderDto.description) {
//         slider.description = updateSliderDto.description as any;
//       }

//       return await this.sliderRepository.save(slider);
//     } catch (error) {
//       if (
//         error instanceof BadRequestException ||
//         error instanceof NotFoundException
//       ) {
//         throw error;
//       }
//       this.logger.error('❌ Error in updateSlider:', error);
//       throw new BadRequestException('სლაიდერის განახლება ვერ მოხერხდა');
//     }
//   }

//   async deleteSlider(id: number): Promise<void> {
//     try {
//       const slider = await this.findOneSlider(id);
//       await this.sliderRepository.delete(id);
//       this.logger.log(`🗑️ Slider ${id} deleted`);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       this.logger.error('❌ Error in deleteSlider:', error);
//       throw new BadRequestException('სლაიდერის წაშლა ვერ მოხერხდა');
//     }
//   }

//   async getSlidersCount(): Promise<{
//     count: number;
//     max: number;
//     canAdd: boolean;
//   }> {
//     try {
//       const count = await this.sliderRepository.count();
//       return {
//         count,
//         max: this.MAX_SLIDERS,
//         canAdd: count < this.MAX_SLIDERS,
//       };
//     } catch (error) {
//       this.logger.error('❌ Error in getSlidersCount:', error);
//       throw new BadRequestException('რაოდენობის ჩატვირთვა ვერ მოხერხდა');
//     }
//   }
// }
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from './entities/slider.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { put, del } from '@vercel/blob';

@Injectable()
export class TravelService {
  private readonly logger = new Logger(TravelService.name);
  private readonly MAX_SLIDERS = 4;
  private readonly ALLOWED_EXTENSIONS = [
    'jpeg',
    'png',
    'jpg',
    'webp',
    'svg',
    'gif',
  ];

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  // Generate unique filename
  private generateFilename(extension: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `slider-${timestamp}-${random}.${extension}`;
  }

  // Upload image to Vercel Blob
  private async uploadImage(base64String: string): Promise<string> {
    // Parse base64
    const matches = base64String.match(
      /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
    );

    if (!matches) {
      throw new BadRequestException('Base64 ფორმატი არასწორია');
    }

    const [, mimeType, base64Data] = matches;
    const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new BadRequestException(
        `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }

    // Generate filename
    const filename = this.generateFilename(extension);

    // Convert base64 to Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    this.logger.log(`☁️ Uploading to Vercel Blob: ${filename}`);

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: `image/${extension}`,
    });

    this.logger.log(`✅ Uploaded: ${blob.url}`);

    // Returns short URL like: https://xyz.public.blob.vercel-storage.com/slider-123.jpg
    return blob.url;
  }

  // Delete image from Vercel Blob
  private async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (imageUrl.includes('blob.vercel-storage.com')) {
        await del(imageUrl);
        this.logger.log(`🗑️ Image deleted from Vercel Blob: ${imageUrl}`);
      }
    } catch (error) {
      this.logger.warn(`⚠️ Failed to delete image: ${imageUrl}`, error);
    }
  }

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    this.logger.log('=== 🚀 createSlider START ===');

    try {
      // Log incoming data
      this.logger.log(`📦 DTO received`);
      this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);

      // Check slider count
      const count = await this.sliderRepository.count();
      this.logger.log(`📊 Current sliders: ${count}/${this.MAX_SLIDERS}`);

      if (count >= this.MAX_SLIDERS) {
        throw new BadRequestException(
          `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი`,
        );
      }

      // Validate base64
      if (
        !createSliderDto.src ||
        !createSliderDto.src.startsWith('data:image/')
      ) {
        this.logger.error('❌ Invalid base64 format');
        throw new BadRequestException('სურათის ფორმატი არასწორია');
      }

      // Upload image to Vercel Blob and get URL
      const imageUrl = await this.uploadImage(createSliderDto.src);

      this.logger.log(`✅ Image URL: ${imageUrl}`);

      // Create slider with Vercel Blob URL (short URL, ~80 characters)
      const sliderData = {
        src: imageUrl, // e.g., "https://abc123.public.blob.vercel-storage.com/slider-123.jpg"
        title: createSliderDto.title,
        description: createSliderDto.description,
      };

      this.logger.log(`💾 Preparing to save slider`);

      const slider = this.sliderRepository.create(sliderData);
      const savedSlider = await this.sliderRepository.save(slider);

      this.logger.log(`✅ Slider saved with ID: ${savedSlider.id}`);
      this.logger.log('=== ✨ createSlider END (SUCCESS) ===');

      return savedSlider;
    } catch (error) {
      this.logger.error('❌ Error in createSlider:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      this.logger.error('❌ Full error:', JSON.stringify(error, null, 2));
      throw new BadRequestException(
        'სლაიდერის შენახვა ვერ მოხერხდა: ' + error.message,
      );
    }
  }

  async findAllSliders(): Promise<Slider[]> {
    try {
      return await this.sliderRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('❌ Error in findAllSliders:', error);
      throw new BadRequestException('სლაიდერების ჩატვირთვა ვერ მოხერხდა');
    }
  }

  async findOneSlider(id: number): Promise<Slider> {
    try {
      const slider = await this.sliderRepository.findOne({ where: { id } });
      if (!slider) {
        throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
      }
      return slider;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('❌ Error in findOneSlider:', error);
      throw new BadRequestException('სლაიდერის ჩატვირთვა ვერ მოხერხდა');
    }
  }

  async updateSlider(
    id: number,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider> {
    try {
      const slider = await this.findOneSlider(id);

      if (
        updateSliderDto.src &&
        updateSliderDto.src.startsWith('data:image/')
      ) {
        // Save old image URL for deletion
        const oldImageUrl = slider.src;

        // Upload new image
        const newImageUrl = await this.uploadImage(updateSliderDto.src);
        slider.src = newImageUrl;

        // Delete old image from Vercel Blob
        if (oldImageUrl) {
          await this.deleteImage(oldImageUrl);
        }

        this.logger.log(`✅ Image updated: ${newImageUrl}`);
      }

      if (updateSliderDto.title) {
        slider.title = updateSliderDto.title as any;
      }
      if (updateSliderDto.description) {
        slider.description = updateSliderDto.description as any;
      }

      return await this.sliderRepository.save(slider);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error('❌ Error in updateSlider:', error);
      throw new BadRequestException('სლაიდერის განახლება ვერ მოხერხდა');
    }
  }

  async deleteSlider(id: number): Promise<void> {
    try {
      const slider = await this.findOneSlider(id);

      // Delete image from Vercel Blob
      if (slider.src) {
        await this.deleteImage(slider.src);
      }

      await this.sliderRepository.delete(id);
      this.logger.log(`🗑️ Slider ${id} deleted`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('❌ Error in deleteSlider:', error);
      throw new BadRequestException('სლაიდერის წაშლა ვერ მოხერხდა');
    }
  }

  async getSlidersCount(): Promise<{
    count: number;
    max: number;
    canAdd: boolean;
  }> {
    try {
      const count = await this.sliderRepository.count();
      return {
        count,
        max: this.MAX_SLIDERS,
        canAdd: count < this.MAX_SLIDERS,
      };
    } catch (error) {
      this.logger.error('❌ Error in getSlidersCount:', error);
      throw new BadRequestException('რაოდენობის ჩატვირთვა ვერ მოხერხდა');
    }
  }
}
