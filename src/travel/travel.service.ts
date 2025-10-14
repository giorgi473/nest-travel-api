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
// import * as fs from 'fs';
// import * as path from 'path';

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

//     // Log incoming data
//     this.logger.log(`📦 DTO Type: ${typeof createSliderDto}`);
//     this.logger.log(`📦 DTO Keys: ${Object.keys(createSliderDto).join(', ')}`);
//     this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);
//     this.logger.log(`📦 Src length: ${createSliderDto.src?.length}`);
//     this.logger.log(`📦 Src preview: ${createSliderDto.src?.substring(0, 50)}`);
//     this.logger.log(`📦 Title: ${JSON.stringify(createSliderDto.title)}`);
//     this.logger.log(
//       `📦 Description: ${JSON.stringify(createSliderDto.description)}`,
//     );

//     // Check slider count
//     const count = await this.sliderRepository.count();
//     this.logger.log(`📊 Current sliders: ${count}/${this.MAX_SLIDERS}`);

//     if (count >= this.MAX_SLIDERS) {
//       throw new BadRequestException(
//         `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი`,
//       );
//     }

//     // Validate base64
//     if (
//       !createSliderDto.src ||
//       !createSliderDto.src.startsWith('data:image/')
//     ) {
//       this.logger.error('❌ Invalid base64 format');
//       throw new BadRequestException('სურათის ფორმატი არასწორია');
//     }

//     // Parse base64
//     const matches = createSliderDto.src.match(
//       /^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/,
//     );

//     if (!matches) {
//       this.logger.error(
//         `❌ Regex failed: ${createSliderDto.src.substring(0, 100)}`,
//       );
//       throw new BadRequestException('Base64 ფორმატი არასწორია');
//     }

//     const [, mimeType, base64Data] = matches;
//     const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

//     this.logger.log(`📝 File type: ${extension}`);

//     if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
//       this.logger.error(`❌ Invalid extension: ${extension}`);
//       throw new BadRequestException(
//         `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
//       );
//     }

//     // Decode base64
//     let buffer: Buffer;
//     try {
//       buffer = Buffer.from(base64Data, 'base64');
//       this.logger.log(`✅ Buffer created, size: ${buffer.length} bytes`);
//     } catch (error) {
//       this.logger.error('❌ Base64 decode error:', error);
//       throw new BadRequestException('Base64 დეკოდირება ვერ მოხერხდა');
//     }

//     // Save file
//     const fileName = `slider-${Date.now()}.${extension}`;
//     const uploadDir = path.join(process.cwd(), 'uploads');
//     const filePath = path.join(uploadDir, fileName);

//     this.logger.log(`💾 File path: ${filePath}`);

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//       this.logger.log('📁 Created uploads folder');
//     }

//     try {
//       fs.writeFileSync(filePath, buffer);
//       this.logger.log('✅ File saved successfully');
//     } catch (error) {
//       this.logger.error('❌ File save error:', error);
//       throw new BadRequestException('ფაილის შენახვა ვერ მოხერხდა');
//     }

//     // Save to database
//     const sliderData = {
//       src: `/uploads/${fileName}`,
//       title: createSliderDto.title,
//       description: createSliderDto.description,
//     };

//     this.logger.log(`💾 Saving to DB: ${JSON.stringify(sliderData)}`);

//     try {
//       const slider = this.sliderRepository.create(sliderData);
//       const savedSlider = await this.sliderRepository.save(slider);
//       this.logger.log(`✅ Slider saved with ID: ${savedSlider.id}`);
//       this.logger.log('=== ✨ createSlider END (SUCCESS) ===');
//       return savedSlider;
//     } catch (error) {
//       this.logger.error('❌ Database save error:', error);
//       // Delete file if DB save fails
//       try {
//         fs.unlinkSync(filePath);
//         this.logger.log('🗑️ Cleaned up file after DB error');
//       } catch {}
//       throw new BadRequestException('სლაიდერის შენახვა ვერ მოხერხდა');
//     }
//   }

//   async findAllSliders(): Promise<Slider[]> {
//     return this.sliderRepository.find({ order: { createdAt: 'DESC' } });
//   }

//   async findOneSlider(id: number): Promise<Slider> {
//     const slider = await this.sliderRepository.findOne({ where: { id } });
//     if (!slider) {
//       throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
//     }
//     return slider;
//   }

//   async updateSlider(
//     id: number,
//     updateSliderDto: UpdateSliderDto,
//   ): Promise<Slider> {
//     const slider = await this.findOneSlider(id);

//     if (updateSliderDto.src && updateSliderDto.src.startsWith('data:image/')) {
//       const matches = updateSliderDto.src.match(
//         /^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/,
//       );

//       if (!matches) {
//         throw new BadRequestException('Base64 ფორმატი არასწორია');
//       }

//       const [, mimeType, base64Data] = matches;
//       const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

//       if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
//         throw new BadRequestException(
//           `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
//         );
//       }

//       const buffer = Buffer.from(base64Data, 'base64');
//       const fileName = `slider-${Date.now()}.${extension}`;
//       const uploadDir = path.join(process.cwd(), 'uploads');
//       const filePath = path.join(uploadDir, fileName);

//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       fs.writeFileSync(filePath, buffer);

//       if (slider.src) {
//         const oldFilePath = path.join(process.cwd(), slider.src.slice(1));
//         if (fs.existsSync(oldFilePath)) {
//           try {
//             fs.unlinkSync(oldFilePath);
//           } catch (error) {
//             this.logger.error('❌ Old file delete error:', error);
//           }
//         }
//       }

//       slider.src = `/uploads/${fileName}`;
//     }

//     if (updateSliderDto.title) {
//       slider.title = updateSliderDto.title as any;
//     }
//     if (updateSliderDto.description) {
//       slider.description = updateSliderDto.description as any;
//     }

//     return this.sliderRepository.save(slider);
//   }

//   async deleteSlider(id: number): Promise<void> {
//     const slider = await this.findOneSlider(id);

//     if (slider.src) {
//       const filePath = path.join(process.cwd(), slider.src.slice(1));
//       if (fs.existsSync(filePath)) {
//         try {
//           fs.unlinkSync(filePath);
//           this.logger.log(`🗑️ File deleted: ${slider.src}`);
//         } catch (error) {
//           this.logger.error('❌ File delete error:', error);
//         }
//       }
//     }

//     await this.sliderRepository.delete(id);
//   }

//   async getSlidersCount(): Promise<{
//     count: number;
//     max: number;
//     canAdd: boolean;
//   }> {
//     const count = await this.sliderRepository.count();
//     return {
//       count,
//       max: this.MAX_SLIDERS,
//       canAdd: count < this.MAX_SLIDERS,
//     };
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
import * as fs from 'fs';
import * as path from 'path';

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

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    this.logger.log('=== 🚀 createSlider START ===');

    // Log incoming data
    this.logger.log(`📦 DTO Type: ${typeof createSliderDto}`);
    this.logger.log(`📦 DTO Keys: ${Object.keys(createSliderDto).join(', ')}`);
    this.logger.log(`📦 Has src: ${!!createSliderDto.src}`);
    this.logger.log(`📦 Src length: ${createSliderDto.src?.length}`);
    this.logger.log(`📦 Src preview: ${createSliderDto.src?.substring(0, 50)}`);
    this.logger.log(`📦 TitleEn: ${createSliderDto.titleEn}`);
    this.logger.log(`📦 TitleKa: ${createSliderDto.titleKa}`);
    this.logger.log(`📦 DescriptionEn: ${createSliderDto.descriptionEn}`);
    this.logger.log(`📦 DescriptionKa: ${createSliderDto.descriptionKa}`);

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
      /^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/,
    );

    if (!matches) {
      this.logger.error(
        `❌ Regex failed: ${createSliderDto.src.substring(0, 100)}`,
      );
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

    // Decode base64
    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
      this.logger.log(`✅ Buffer created, size: ${buffer.length} bytes`);
    } catch (error) {
      this.logger.error('❌ Base64 decode error:', error.message, error.stack);
      throw new BadRequestException('Base64 დეკოდირება ვერ მოხერხდა');
    }

    // Save file
    const fileName = `slider-${Date.now()}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, fileName);

    this.logger.log(`💾 File path: ${filePath}`);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      this.logger.log('📁 Created uploads folder');
    }

    try {
      fs.writeFileSync(filePath, buffer);
      this.logger.log('✅ File saved successfully');
    } catch (error) {
      this.logger.error('❌ File save error:', error.message, error.stack);
      throw new BadRequestException('ფაილის შენახვა ვერ მოხერხდა');
    }

    // Map DTO to entity structure
    const sliderData = {
      src: `/uploads/${fileName}`,
      title: {
        en: createSliderDto.titleEn,
        ka: createSliderDto.titleKa,
      },
      description: {
        en: createSliderDto.descriptionEn,
        ka: createSliderDto.descriptionKa,
      },
    };

    this.logger.log(`💾 Saving to DB: ${JSON.stringify(sliderData)}`);

    try {
      const slider = this.sliderRepository.create(sliderData);
      this.logger.log(`✅ Slider entity created: ${JSON.stringify(slider)}`);
      const savedSlider = await this.sliderRepository.save(slider);
      this.logger.log(`✅ Slider saved with ID: ${savedSlider.id}`);
      this.logger.log('=== ✨ createSlider END (SUCCESS) ===');
      return savedSlider;
    } catch (error) {
      this.logger.error('❌ Database save error:', error.message, error.stack);
      this.logger.error('❌ Failed slider data:', JSON.stringify(sliderData));
      try {
        fs.unlinkSync(filePath);
        this.logger.log('🗑️ Cleaned up file after DB error');
      } catch (cleanupError) {
        this.logger.error(
          '❌ File cleanup error:',
          cleanupError.message,
          cleanupError.stack,
        );
      }
      throw new BadRequestException(
        `სლაიდერის შენახვა ვერ მოხერხდა: ${error.message}`,
      );
    }
  }

  async testSliderSave(): Promise<Slider> {
    const testData = {
      src: '/uploads/test-image.webp',
      title: { en: 'Test Title', ka: 'ტესტის სათაური' },
      description: { en: 'Test Description', ka: 'ტესტის აღწერა' },
    };
    this.logger.log(`💾 Test save data: ${JSON.stringify(testData)}`);
    try {
      const slider = this.sliderRepository.create(testData);
      const savedSlider = await this.sliderRepository.save(slider);
      this.logger.log(`✅ Test slider saved with ID: ${savedSlider.id}`);
      return savedSlider;
    } catch (error) {
      this.logger.error('❌ Test save error:', error.message, error.stack);
      throw new BadRequestException(`Test save failed: ${error.message}`);
    }
  }

  async findAllSliders(): Promise<Slider[]> {
    return this.sliderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneSlider(id: number): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
    }
    return slider;
  }

  async updateSlider(
    id: number,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider> {
    const slider = await this.findOneSlider(id);

    if (updateSliderDto.src && updateSliderDto.src.startsWith('data:image/')) {
      const matches = updateSliderDto.src.match(
        /^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/,
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

      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `slider-${Date.now()}.${extension}`;
      const uploadDir = path.join(process.cwd(), 'uploads');
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(filePath, buffer);

      if (slider.src) {
        const oldFilePath = path.join(process.cwd(), slider.src.slice(1));
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (error) {
            this.logger.error(
              '❌ Old file delete error:',
              error.message,
              error.stack,
            );
          }
        }
      }

      slider.src = `/uploads/${fileName}`;
    }

    if (updateSliderDto.titleEn || updateSliderDto.titleKa) {
      slider.title = {
        en: updateSliderDto.titleEn || slider.title.en,
        ka: updateSliderDto.titleKa || slider.title.ka,
      };
    }

    if (updateSliderDto.descriptionEn || updateSliderDto.descriptionKa) {
      slider.description = {
        en: updateSliderDto.descriptionEn || slider.description.en,
        ka: updateSliderDto.descriptionKa || slider.description.ka,
      };
    }

    return this.sliderRepository.save(slider);
  }

  async deleteSlider(id: number): Promise<void> {
    const slider = await this.findOneSlider(id);

    if (slider.src) {
      const filePath = path.join(process.cwd(), slider.src.slice(1));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          this.logger.log(`🗑️ File deleted: ${slider.src}`);
        } catch (error) {
          this.logger.error(
            '❌ File delete error:',
            error.message,
            error.stack,
          );
        }
      }
    }

    await this.sliderRepository.delete(id);
  }

  async getSlidersCount(): Promise<{
    count: number;
    max: number;
    canAdd: boolean;
  }> {
    const count = await this.sliderRepository.count();
    return {
      count,
      max: this.MAX_SLIDERS,
      canAdd: count < this.MAX_SLIDERS,
    };
  }
}
