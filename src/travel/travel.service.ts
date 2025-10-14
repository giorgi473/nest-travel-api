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
    const count = await this.sliderRepository.count();
    if (count >= this.MAX_SLIDERS) {
      throw new BadRequestException(
        `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი.`,
      );
    }

    console.log(
      'მიღებული base64 (პირველი 50 სიმბოლო):',
      createSliderDto.src?.substring(0, 50),
    );
    if (
      !createSliderDto.src ||
      !createSliderDto.src.startsWith('data:image/')
    ) {
      throw new BadRequestException(
        'სურათის base64 ფორმატი არასწორია ან არ არსებობს',
      );
    }

    const matches = createSliderDto.src.match(
      /^data:image\/([a-zA-Z0-9-+\/]+);base64,(.+)$/,
    );
    if (!matches) {
      console.error('Regex შეცდომა:', createSliderDto.src?.substring(0, 100));
      throw new BadRequestException('Base64 სტრიქონის ფორმატი არასწორია');
    }

    const extension = matches[1].toLowerCase();
    const normalizedExtension = extension === 'svg+xml' ? 'svg' : extension;
    if (!this.ALLOWED_EXTENSIONS.includes(normalizedExtension)) {
      console.error('არადაშვებული ფაილის ტიპი:', extension);
      throw new BadRequestException(
        `დაშვებულია მხოლოდ ${this.ALLOWED_EXTENSIONS.join(', ')} ფორმატები`,
      );
    }

    const base64Data = matches[2];
    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
    } catch (error) {
      console.error('Base64 დეკოდირების შეცდომა:', error);
      throw new BadRequestException(
        'Base64 მონაცემების დეკოდირება ვერ მოხერხდა',
      );
    }

    const fileName = `slider-${Date.now()}.${normalizedExtension}`;
    const uploadDir = path.join(process.cwd(), 'Uploads');
    const filePath = path.join(uploadDir, fileName);

    console.log('ფაილის შენახვის მისამართი:', filePath);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('შეიქმნა uploads ფოლდერი:', uploadDir);
    }

    try {
      fs.writeFileSync(filePath, buffer);
      console.log('ფაილი წარმატებით შეინახა:', filePath);
    } catch (error) {
      console.error('ფაილის შენახვის შეცდომა:', error);
      throw new BadRequestException('ფაილის შენახვა ვერ მოხერხდა');
    }

    createSliderDto.src = `/uploads/${fileName}`; // ქვედა რეგისტრი
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
      throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
    }
    return slider;
  }

  async updateSlider(
    id: number,
    updateSliderDto: UpdateSliderDto,
  ): Promise<Slider> {
    const slider = await this.findOneSlider(id);

    if (updateSliderDto.src) {
      console.log(
        'მიღებული base64 განახლებისთვის:',
        updateSliderDto.src?.substring(0, 50),
      );
      if (!updateSliderDto.src.startsWith('data:image/')) {
        throw new BadRequestException('სურათის base64 ფორმატი არასწორია');
      }

      const matches = updateSliderDto.src.match(
        /^data:image\/([a-zA-Z0-9-+\/]+);base64,(.+)$/,
      );
      if (!matches) {
        console.error('Regex შეცდომა განახლებაში:', updateSliderDto.src);
        throw new BadRequestException('Base64 სტრიქონის ფორმატი არასწორია');
      }

      const extension = matches[1].toLowerCase();
      const normalizedExtension = extension === 'svg+xml' ? 'svg' : extension;
      if (!this.ALLOWED_EXTENSIONS.includes(normalizedExtension)) {
        console.error('არადაშვებული ფაილის ტიპი:', extension);
        throw new BadRequestException(
          `დაშვებულია მხოლოდ ${this.ALLOWED_EXTENSIONS.join(', ')} ფორმატები`,
        );
      }

      const base64Data = matches[2];
      let buffer: Buffer;
      try {
        buffer = Buffer.from(base64Data, 'base64');
      } catch (error) {
        console.error('Base64 დეკოდირების შეცდომა განახლებაში:', error);
        throw new BadRequestException(
          'Base64 მონაცემების დეკოდირება ვერ მოხერხდა',
        );
      }

      const fileName = `slider-${Date.now()}.${normalizedExtension}`;
      const uploadDir = path.join(process.cwd(), 'Uploads');
      const filePath = path.join(uploadDir, fileName);

      console.log('ფაილის განახლების მისამართი:', filePath);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('შეიქმნა uploads ფოლდერი:', uploadDir);
      }

      try {
        fs.writeFileSync(filePath, buffer);
        console.log('ფაილი წარმატებით განახლდა:', filePath);
      } catch (error) {
        console.error('ფაილის განახლების შეცდომა:', error);
        throw new BadRequestException('ფაილის განახლება ვერ მოხერხდა');
      }

      if (
        slider.src &&
        fs.existsSync(path.join(process.cwd(), slider.src.slice(1)))
      ) {
        try {
          fs.unlinkSync(path.join(process.cwd(), slider.src.slice(1)));
          console.log('ძველი ფაილი წაიშალა:', slider.src);
        } catch (error) {
          console.error('ძველი ფაილის წაშლის შეცდომა:', error);
        }
      }

      slider.src = `/uploads/${fileName}`; // ქვედა რეგისტრი
    }

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

    if (
      slider.src &&
      fs.existsSync(path.join(process.cwd(), slider.src.slice(1)))
    ) {
      try {
        fs.unlinkSync(path.join(process.cwd(), slider.src.slice(1)));
        console.log('ფაილი წაიშალა:', slider.src);
      } catch (error) {
        console.error('ფაილის წაშლის შეცდომა:', error);
      }
    }

    const result = await this.sliderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`სლაიდერი ID ${id}-ით ვერ მოიძებნა`);
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
