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

@Injectable()
export class TravelService {
  private readonly MAX_SLIDERS = 4;

  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<Slider> {
    // შევამოწმოთ რამდენი სლაიდერია უკვე
    const count = await this.sliderRepository.count();

    if (count >= this.MAX_SLIDERS) {
      throw new BadRequestException(
        `შეგიძლიათ შექმნათ მაქსიმუმ ${this.MAX_SLIDERS} სლაიდერი. გთხოვთ წაშალოთ არსებული სლაიდერი ახლის დასამატებლად.`,
      );
    }

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

    // თუ title განახლდება, მთლიანად შეცვალე ობიექტი
    if (updateSliderDto.title) {
      slider.title = updateSliderDto.title;
    }

    // თუ description განახლდება, მთლიანად შეცვალე ობიექტი
    if (updateSliderDto.description) {
      slider.description = updateSliderDto.description;
    }

    // src-ს განახლება
    if (updateSliderDto.src) {
      slider.src = updateSliderDto.src;
    }

    return this.sliderRepository.save(slider);
  }

  async deleteSlider(id: number): Promise<void> {
    const result = await this.sliderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }
  }

  // დამატებითი: მხოლოდ ერთი ენის განახლება
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

  // დამატებითი: მიმდინარე რაოდენობის შემოწმება
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
