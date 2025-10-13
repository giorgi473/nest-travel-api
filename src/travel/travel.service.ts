import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
  private readonly MAX_SLIDERS = 4;
  private readonly ALLOWED_EXTENSIONS = ['jpeg', 'png', 'jpg', 'webp', 'svg'];

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    // Check the current number of sliders
    const count = await this.sliderRepository.count();
    if (count >= this.MAX_SLIDERS) {
      throw new BadRequestException(
        `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი. გთხოვთ წაშალოთ ა�რსებული სლაიდერი ახლის დასამატებლად.`,
      );
    }

    // Validate and process base64 image
    const matches = createSliderDto.src.match(
      /^data:image\/([a-zA-Z]+);base64,(.+)$/,
    );
    if (!matches) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const extension = matches[1].toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new BadRequestException('Only JPEG and PNG images are allowed');
    }

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `slider-${Date.now()}.${extension}`;
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

    // Ensure the uploads directory exists
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      throw new BadRequestException('Failed to save image');
    }

    // Update src to store the file path
    createSliderDto.src = `/uploads/${fileName}`;

    const slider = this.sliderRepository.create(createSliderDto);
    return this.sliderRepository.save(slider);
  }

  async findAllSliders(): Promise<Slider[]> {
    return this.sliderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneSlider(id: number): Promise<Slider> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }
    return slider;
  }

  async updateSlider(
    id: number,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider> {
    const slider = await this.findOneSlider(id);

    // Process base64 image if provided
    if (updateSliderDto.src) {
      const matches = updateSliderDto.src.match(
        /^data:image\/([a-zA-Z]+);base64,(.+)$/,
      );
      if (!matches) {
        throw new BadRequestException('Invalid base64 image format');
      }

      const extension = matches[1].toLowerCase();
      if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
        throw new BadRequestException('Only JPEG and PNG images are allowed');
      }

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `slider-${Date.now()}.${extension}`;
      const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);

      // Ensure the uploads directory exists
      const uploadDir = path.dirname(filePath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the new file
      try {
        fs.writeFileSync(filePath, buffer);
      } catch (error) {
        throw new BadRequestException('Failed to save image');
      }

      // Delete the old image file if it exists
      if (
        slider.src &&
        fs.existsSync(path.join(__dirname, '..', '..', slider.src))
      ) {
        fs.unlinkSync(path.join(__dirname, '..', '..', slider.src));
      }

      // Update src to new file path
      slider.src = `/uploads/${fileName}`;
    }

    // Update title and description if provided
    if (updateSliderDto.title) {
      slider.title = updateSliderDto.title;
    }
    if (updateSliderDto.description) {
      slider.description = updateSliderDto.description;
    }

    return this.sliderRepository.save(slider);
  }

  async deleteSlider(id: number): Promise<void> {
    const slider = await this.findOneSlider(id);

    // Delete the associated image file
    if (
      slider.src &&
      fs.existsSync(path.join(__dirname, '..', '..', slider.src))
    ) {
      fs.unlinkSync(path.join(__dirname, '..', '..', slider.src));
    }

    const result = await this.sliderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }
  }

  async updateSliderLanguage(
    id: number,
    lang: 'ka' | 'en',
    field: 'title' | 'description',
    value: string,
  ): Promise<Slider> {
    const slider = await this.findOneSlider(id);
    slider[field][lang] = value;
    return this.sliderRepository.save(slider);
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
