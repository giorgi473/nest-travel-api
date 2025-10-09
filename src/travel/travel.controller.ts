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
import { TravelService } from './travel.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Controller('api/v1/slider')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSliderDto: CreateSliderDto) {
    return this.travelService.createSlider(createSliderDto);
  }

  @Get()
  async findAll(@Query('lang') lang?: 'ka' | 'en') {
    const sliders = await this.travelService.findAllSliders();

    // თუ ენა მითითებულია, დააბრუნე მხოლოდ იმ ენაზე
    if (lang) {
      return sliders.map((slider) => ({
        id: slider.id,
        src: slider.src,
        title: slider.title[lang],
        description: slider.description[lang],
        createdAt: slider.createdAt,
        updatedAt: slider.updatedAt,
      }));
    }

    // თუ არა, დააბრუნე ორივე ენა
    return sliders;
  }

  @Get('count')
  async getCount() {
    return this.travelService.getSlidersCount();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: 'ka' | 'en',
  ) {
    const slider = await this.travelService.findOneSlider(id);

    if (lang) {
      return {
        id: slider.id,
        src: slider.src,
        title: slider.title[lang],
        description: slider.description[lang],
        createdAt: slider.createdAt,
        updatedAt: slider.updatedAt,
      };
    }

    return slider;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSliderDto: UpdateSliderDto,
  ) {
    return this.travelService.updateSlider(id, updateSliderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.travelService.deleteSlider(id);
  }
}
