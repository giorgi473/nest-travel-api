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
import sharp from 'sharp';

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
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  // Aggressive optimization settings
  private readonly THUMBNAIL_WIDTH = 400;
  private readonly THUMBNAIL_QUALITY = 45;
  private readonly FULL_WIDTH = 800;
  private readonly FULL_QUALITY = 60;

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  /**
   * Aggressive image compression with multiple quality levels
   */
  private async compressImage(
    imageBuffer: Buffer,
    width: number,
    quality: number,
  ): Promise<Buffer> {
    try {
      return await sharp(imageBuffer)
        .resize({
          width,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({
          quality,
          effort: 6, // Maximum compression effort
          smartSubsample: true,
        })
        .toBuffer();
    } catch (error) {
      this.logger.error('Sharp compression failed:', error.message);
      return imageBuffer;
    }
  }

  /**
   * Create both thumbnail and full-size optimized images
   */
  private async processImage(
    base64Data: string,
    extension: string,
  ): Promise<{
    thumbnail: string;
    full: string;
  }> {
    const imageBuffer = Buffer.from(base64Data, 'base64');

    if (imageBuffer.length > this.MAX_IMAGE_SIZE) {
      throw new BadRequestException('სურათის ზომა აღემატება 5MB-ს');
    }

    if (extension === 'svg') {
      // SVG doesn't need compression
      const svgBase64 = `data:image/svg+xml;base64,${imageBuffer.toString('base64')}`;
      return { thumbnail: svgBase64, full: svgBase64 };
    }

    // Create thumbnail (ultra compressed)
    const thumbnailBuffer = await this.compressImage(
      imageBuffer,
      this.THUMBNAIL_WIDTH,
      this.THUMBNAIL_QUALITY,
    );

    // Create full image (moderately compressed)
    const fullBuffer = await this.compressImage(
      imageBuffer,
      this.FULL_WIDTH,
      this.FULL_QUALITY,
    );

    this.logger.log(
      `📷 Original: ${imageBuffer.length} bytes → ` +
        `Thumbnail: ${thumbnailBuffer.length} bytes (${Math.round((thumbnailBuffer.length / imageBuffer.length) * 100)}%) → ` +
        `Full: ${fullBuffer.length} bytes (${Math.round((fullBuffer.length / imageBuffer.length) * 100)}%)`,
    );

    return {
      thumbnail: `data:image/webp;base64,${thumbnailBuffer.toString('base64')}`,
      full: `data:image/webp;base64,${fullBuffer.toString('base64')}`,
    };
  }

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    this.logger.log('=== 🚀 createSlider START ===');

    try {
      this.logger.log(`📦 DTO received`);
      this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);
      this.logger.log(`📦 Src length: ${createSliderDto.src?.length || 0}`);

      const count = await this.sliderRepository.count();
      this.logger.log(`📊 Current sliders: ${count}/${this.MAX_SLIDERS}`);

      if (count >= this.MAX_SLIDERS) {
        throw new BadRequestException(
          `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი`,
        );
      }

      if (
        !createSliderDto.src ||
        !createSliderDto.src.startsWith('data:image/')
      ) {
        this.logger.error('❌ Invalid base64 format');
        throw new BadRequestException('სურათის ფორმატი არასწორია');
      }

      const matches = createSliderDto.src.match(
        /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
      );

      if (!matches) {
        this.logger.error(`❌ Regex failed for base64 string`);
        throw new BadRequestException('Base64 ფორმატი არასწორია');
      }

      const [, mimeType, base64Data] = matches;
      const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

      this.logger.log(`📝 File type: ${extension}`);

      if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
        this.logger.error(`❌ Invalid extension: ${extension}`);
        throw new BadRequestException(
          `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
        );
      }

      // Process image with aggressive compression
      const { thumbnail, full } = await this.processImage(
        base64Data,
        extension,
      );

      // Store thumbnail in main src (for list views)
      // Store full image in a separate field if needed, or just use thumbnail
      const sliderData = {
        src: thumbnail, // Use thumbnail by default for faster loading
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
      this.logger.error('❌ Error in createSlider:', error.message);
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
        const matches = updateSliderDto.src.match(
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

        // Process with aggressive compression
        const { thumbnail } = await this.processImage(base64Data, extension);
        slider.src = thumbnail;
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
