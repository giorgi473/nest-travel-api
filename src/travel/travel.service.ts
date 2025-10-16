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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

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

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    this.logger.log('=== 🚀 createSlider START ===');

    try {
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

      // Parse and validate extension
      const matches = createSliderDto.src.match(
        /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
      );

      if (!matches) {
        this.logger.error(`❌ Regex failed for base64 string`);
        throw new BadRequestException('Base64 ფორმატი არასწორია');
      }

      const [, mimeType] = matches;
      const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

      this.logger.log(`📝 File type: ${extension}`);

      if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
        this.logger.error(`❌ Invalid extension: ${extension}`);
        throw new BadRequestException(
          `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
        );
      }

      // 🔥 Upload to Cloudinary
      this.logger.log('☁️ Uploading to Cloudinary...');
      const uploadResult = await this.cloudinaryService.uploadImage(
        createSliderDto.src,
        'travel-sliders',
      );

      // Create slider with Cloudinary URL
      const sliderData = {
        src: uploadResult.url, // Cloudinary URL (ნაცვლად base64-ს)
        cloudinaryPublicId: uploadResult.publicId, // შევინახავთ public_id-ს წასაშლელად
        title: createSliderDto.title,
        description: createSliderDto.description,
      };

      this.logger.log(`💾 Preparing to save slider`);

      const slider = this.sliderRepository.create(sliderData);
      const savedSlider = await this.sliderRepository.save(slider);

      this.logger.log(`✅ Slider saved with ID: ${savedSlider.id}`);
      this.logger.log(`☁️ Cloudinary URL: ${uploadResult.url}`);
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

      // თუ ახალი სურათია
      if (
        updateSliderDto.src &&
        updateSliderDto.src.startsWith('data:image/')
      ) {
        // Validate extension
        const matches = updateSliderDto.src.match(
          /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
        );

        if (!matches) {
          throw new BadRequestException('Base64 ფორმატი არასწორია');
        }

        const [, mimeType] = matches;
        const extension = mimeType.replace('svg+xml', 'svg').toLowerCase();

        if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
          throw new BadRequestException(
            `დაშვებულია: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
          );
        }

        // წავშალოთ ძველი სურათი Cloudinary-დან
        if (slider.cloudinaryPublicId) {
          await this.cloudinaryService.deleteImage(slider.cloudinaryPublicId);
        }

        // ავტვირთოთ ახალი
        const uploadResult = await this.cloudinaryService.uploadImage(
          updateSliderDto.src,
          'travel-sliders',
        );

        slider.src = uploadResult.url;
        slider.cloudinaryPublicId = uploadResult.publicId;
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

      // წავშალოთ სურათი Cloudinary-დან
      if (slider.cloudinaryPublicId) {
        await this.cloudinaryService.deleteImage(slider.cloudinaryPublicId);
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
