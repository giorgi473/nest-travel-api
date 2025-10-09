import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SeasonalAdventuresService } from './seasonal-adventures.service';
import { CreateSeasonalAdventureDto } from './dto/create-seasonal-adventure.dto';
import { UpdateSeasonalAdventureDto } from './dto/update-seasonal-adventure.dto';

@Controller('api/v1/seasonal-adventures')
export class SeasonalAdventuresController {
  constructor(
    private readonly seasonalAdventuresService: SeasonalAdventuresService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateSeasonalAdventureDto) {
    return this.seasonalAdventuresService.create(createDto);
  }

  @Get()
  async findAll(@Query('lang') lang?: 'ka' | 'en') {
    return this.seasonalAdventuresService.findAll(lang);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: 'ka' | 'en',
  ) {
    return this.seasonalAdventuresService.findOne(id, lang);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSeasonalAdventureDto,
  ) {
    return this.seasonalAdventuresService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.seasonalAdventuresService.remove(id);
  }
}
