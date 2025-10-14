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
  private readonly MAX_SLIDERS = 3;
  private readonly ALLOWED_EXTENSIONS = [
    'jpeg',
    'png',
    'jpg',
    'webp',
    'svg',
    'gif',
  ];
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly TARGET_WIDTH = 800; // სურათის სიგანე resize-ისთვის

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    this.logger.log('=== 🚀 createSlider START ===');

    try {
      // Log incoming data
      this.logger.log(`📦 DTO received`);
      this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);
      this.logger.log(`📦 Src length: ${createSliderDto.src?.length || 0}`);
      this.logger.log(`📦 Title: ${JSON.stringify(createSliderDto.title)}`);
      this.logger.log(
        `📦 Description: ${JSON.stringify(createSliderDto.description)}`,
      );

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

      // Parse base64
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

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Check initial size
      if (imageBuffer.length > this.MAX_IMAGE_SIZE) {
        this.logger.error('❌ Image size exceeds 5MB');
        throw new BadRequestException('სურათის ზომა აღემატება 5MB-ს');
      }

      // Resize and compress image using sharp with error handling
      let compressedImage: Buffer = imageBuffer; // Default to original if sharp fails
      if (extension !== 'svg') {
        try {
          this.logger.log('📷 Starting image compression with sharp');
          compressedImage = await sharp(imageBuffer)
            .resize({ width: this.TARGET_WIDTH, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          this.logger.log('📷 Image compression completed');
        } catch (sharpError) {
          this.logger.error(
            '❌ Sharp compression failed, using original image:',
            sharpError.message,
          );
        }
      } else {
        this.logger.log('📷 SVG image, no compression applied');
      }

      // Convert compressed image back to base64
      const compressedBase64 = `data:image/${
        extension === 'svg' ? 'svg+xml' : 'webp'
      };base64,${compressedImage.toString('base64')}`;

      this.logger.log('💾 Storing compressed base64 in database');

      // Create slider with compressed base64
      const sliderData = {
        src: compressedBase64,
        title: createSliderDto.title,
        description: createSliderDto.description,
      };

      this.logger.log(`💾 Preparing to save slider`);

      const slider = this.sliderRepository.create(sliderData);

      this.logger.log(`✅ Slider entity created`);

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

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Check size
        if (imageBuffer.length > this.MAX_IMAGE_SIZE) {
          this.logger.error('❌ Image size exceeds 5MB');
          throw new BadRequestException('სურათის ზომა აღემატება 5MB-ს');
        }

        // Resize and compress image using sharp with error handling
        let compressedImage: Buffer = imageBuffer; // Default to original if sharp fails
        if (extension !== 'svg') {
          try {
            this.logger.log('📷 Starting image compression with sharp');
            compressedImage = await sharp(imageBuffer)
              .resize({ width: this.TARGET_WIDTH, withoutEnlargement: true })
              .webp({ quality: 80 })
              .toBuffer();
            this.logger.log('📷 Image compression completed');
          } catch (sharpError) {
            this.logger.error(
              '❌ Sharp compression failed, using original image:',
              sharpError.message,
            );
          }
        } else {
          this.logger.log('📷 SVG image, no compression applied');
        }

        // Convert back to base64
        slider.src = `data:image/${
          extension === 'svg' ? 'svg+xml' : 'webp'
        };base64,${compressedImage.toString('base64')}`;
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
