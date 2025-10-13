// georgian-gastronomy.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { GeorgianGastronomyService } from './georgian-gastronomy.service';
import { CreateDishDto } from './dto/create-georgian-gastronomy.dto';
import { UpdateDishDto } from './dto/update-georgian-gastronomy.dto';

@Controller('georgian-gastronomy')
export class GeorgianGastronomyController {
  constructor(private readonly gastronomyService: GeorgianGastronomyService) {}

  @Get('collections')
  async getCollections() {
    return await this.gastronomyService.getGeorgianCuisineCollection();
  }

  @Get('dishes')
  async findAll() {
    return await this.gastronomyService.findAll();
  }

  @Get('dishes/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.gastronomyService.findOne(id);
  }

  @Get('collections/:collectionId')
  async findByCollection(@Param('collectionId') collectionId: string) {
    return await this.gastronomyService.findByCollection(collectionId);
  }

  @Post('dishes')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDishDto: CreateDishDto) {
    return await this.gastronomyService.create(createDishDto);
  }

  @Put('dishes/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    return await this.gastronomyService.update(id, updateDishDto);
  }

  @Delete('dishes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.gastronomyService.remove(id);
  }
}
