import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeasonalAdventure } from './entities/seasonal-adventure.entity';
import { CreateSeasonalAdventureDto } from './dto/create-seasonal-adventure.dto';
import { UpdateSeasonalAdventureDto } from './dto/update-seasonal-adventure.dto';

@Injectable()
export class SeasonalAdventuresService {
  constructor(
    @InjectRepository(SeasonalAdventure)
    private seasonalAdventureRepository: Repository<SeasonalAdventure>,
  ) {}

  async create(
    createDto: CreateSeasonalAdventureDto,
  ): Promise<SeasonalAdventure> {
    const adventure = this.seasonalAdventureRepository.create(createDto);
    return this.seasonalAdventureRepository.save(adventure);
  }

  async findAll(lang?: 'ka' | 'en'): Promise<SeasonalAdventure[]> {
    const adventures = await this.seasonalAdventureRepository.find({
      order: { createdAt: 'DESC' },
    });

    if (lang) {
      return adventures.map((adv) => this.transformToLanguage(adv, lang));
    }

    return adventures;
  }

  async findOne(id: number, lang?: 'ka' | 'en'): Promise<SeasonalAdventure> {
    const adventure = await this.seasonalAdventureRepository.findOne({
      where: { id },
    });

    if (!adventure) {
      throw new NotFoundException(`Seasonal Adventure with ID ${id} not found`);
    }

    if (lang) {
      return this.transformToLanguage(adventure, lang);
    }

    return adventure;
  }

  async update(
    id: number,
    updateDto: UpdateSeasonalAdventureDto,
  ): Promise<SeasonalAdventure> {
    const adventure = await this.findOne(id);

    Object.assign(adventure, {
      image: updateDto.image ?? adventure.image,
      title: updateDto.title ?? adventure.title,
      description: updateDto.description ?? adventure.description,
      header: updateDto.header ?? adventure.header,
      headerDescription:
        updateDto.headerDescription ?? adventure.headerDescription,
    });

    return this.seasonalAdventureRepository.save(adventure);
  }

  async remove(id: number): Promise<void> {
    const result = await this.seasonalAdventureRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Seasonal Adventure with ID ${id} not found`);
    }
  }

  private transformToLanguage(adventure: any, lang: 'ka' | 'en'): any {
    return {
      ...adventure,
      title: adventure.title?.[lang],
      description: adventure.description?.[lang],
      header: adventure.header?.[lang],
      headerDescription: adventure.headerDescription?.[lang],
    };
  }
}
