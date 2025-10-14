// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   Query,
//   ParseIntPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { TravelService } from './travel.service';
// import { CreateSliderDto } from './dto/create-slider.dto';
// import { UpdateSliderDto } from './dto/update-slider.dto';

// @Controller('slider')
// export class TravelController {
//   constructor(private readonly travelService: TravelService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(@Body() createSliderDto: CreateSliderDto) {
//     console.log('🎯 Controller: Received POST request');
//     console.log('🎯 Body type:', typeof createSliderDto);
//     console.log('🎯 Body keys:', Object.keys(createSliderDto));
//     console.log('🎯 Has src:', !!createSliderDto.src);
//     console.log('🎯 Has title:', !!createSliderDto.title);
//     console.log('🎯 Has description:', !!createSliderDto.description);

//     try {
//       const result = await this.travelService.createSlider(createSliderDto);
//       console.log('✅ Controller: Success');
//       return result;
//     } catch (error) {
//       console.error('❌ Controller Error:', error);
//       throw error;
//     }
//   }

//   @Get()
//   async findAll(@Query('lang') lang?: 'ka' | 'en') {
//     const sliders = await this.travelService.findAllSliders();

//     if (lang) {
//       return sliders.map((slider) => ({
//         id: slider.id,
//         src: slider.src,
//         title: slider.title[lang],
//         description: slider.description[lang],
//         createdAt: slider.createdAt,
//         updatedAt: slider.updatedAt,
//       }));
//     }

//     return sliders;
//   }

//   @Get('count')
//   async getCount() {
//     return this.travelService.getSlidersCount();
//   }

//   @Get(':id')
//   async findOne(
//     @Param('id', ParseIntPipe) id: number,
//     @Query('lang') lang?: 'ka' | 'en',
//   ) {
//     const slider = await this.travelService.findOneSlider(id);

//     if (lang) {
//       return {
//         id: slider.id,
//         src: slider.src,
//         title: slider.title[lang],
//         description: slider.description[lang],
//         createdAt: slider.createdAt,
//         updatedAt: slider.updatedAt,
//       };
//     }

//     return slider;
//   }

//   @Put(':id')
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateSliderDto: UpdateSliderDto,
//   ) {
//     return this.travelService.updateSlider(id, updateSliderDto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.travelService.deleteSlider(id);
//   }
// }
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
import { Logger } from '@nestjs/common';

@Controller('slider')
export class TravelController {
  private readonly logger = new Logger(TravelController.name);

  constructor(private readonly travelService: TravelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSliderDto: CreateSliderDto) {
    this.logger.log('🎯 Controller: Received POST request');
    this.logger.log('🎯 Body type:', typeof createSliderDto);
    this.logger.log('🎯 Body keys:', Object.keys(createSliderDto));
    this.logger.log('🎯 Has src:', !!createSliderDto.src);
    this.logger.log('🎯 Has titleEn:', !!createSliderDto.titleEn);
    this.logger.log('🎯 Has titleKa:', !!createSliderDto.titleKa);
    this.logger.log('🎯 Has descriptionEn:', !!createSliderDto.descriptionEn);
    this.logger.log('🎯 Has descriptionKa:', !!createSliderDto.descriptionKa);

    try {
      const result = await this.travelService.createSlider(createSliderDto);
      this.logger.log('✅ Controller: Success');
      return { success: true, data: result };
    } catch (error) {
      this.logger.error('❌ Controller Error:', error.message, error.stack);
      return {
        success: false,
        error: error.message || 'Internal server error',
      };
    }
  }

  @Get('test-save')
  async testSave() {
    try {
      const result = await this.travelService.testSliderSave();
      return { success: true, data: result };
    } catch (error) {
      this.logger.error('❌ Test Save Error:', error.message, error.stack);
      return {
        success: false,
        error: error.message || 'Internal server error',
      };
    }
  }

  @Get()
  async findAll(@Query('lang') lang?: 'ka' | 'en') {
    const sliders = await this.travelService.findAllSliders();

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
