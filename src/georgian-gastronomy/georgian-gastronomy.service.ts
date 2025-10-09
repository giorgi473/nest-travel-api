// georgian-gastronomy.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { Dish } from './entities/georgian-gastronomy.entity';
import { CreateDishDto } from './dto/create-georgian-gastronomy.dto';
import { UpdateDishDto } from './dto/update-georgian-gastronomy.dto';

@Injectable()
export class GeorgianGastronomyService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}

  async getGeorgianCuisineCollection(): Promise<CollectionResponseDto[]> {
    const dishes = await this.dishRepository.find({
      where: { collectionId: 'Georgian Cuisine' },
      order: { id: 'ASC' },
    });

    return [
      {
        id: 'Georgian Cuisine',
        title: 'Georgian Cuisine Collection',
        array: dishes,
      },
    ];
  }

  async create(createDishDto: CreateDishDto): Promise<Dish> {
    const dish = this.dishRepository.create(createDishDto);
    return await this.dishRepository.save(dish);
  }

  async findAll(): Promise<Dish[]> {
    return await this.dishRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return dish;
  }

  async update(id: number, updateDishDto: UpdateDishDto): Promise<Dish> {
    const dish = await this.findOne(id);

    Object.assign(dish, updateDishDto);

    return await this.dishRepository.save(dish);
  }

  async remove(id: number): Promise<void> {
    const dish = await this.findOne(id);
    await this.dishRepository.remove(dish);
  }

  async findByCollection(collectionId: string): Promise<Dish[]> {
    return await this.dishRepository.find({
      where: { collectionId },
      order: { id: 'ASC' },
    });
  }
}
