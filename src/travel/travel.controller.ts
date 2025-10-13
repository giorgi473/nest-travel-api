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
//     return this.travelService.createSlider(createSliderDto);
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
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TravelService } from './travel.service';

// 👇 დარწმუნდი რომ path სწორია
@Controller('slider') // ← ეს უნდა იყოს
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createSlider(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') titleJson: string,
    @Body('description') descriptionJson: string,
  ) {
    console.log('📨 POST /api/v1/slider - Received request');
    console.log('📁 File:', file?.originalname, file?.size);
    console.log('📝 Title JSON:', titleJson);
    console.log('📝 Description JSON:', descriptionJson);

    if (!file) {
      throw new BadRequestException('ფაილი აუცილებელია');
    }

    if (!titleJson) {
      throw new BadRequestException('სათაური აუცილებელია');
    }

    let title: { en: string; ka: string };
    let description: { en: string; ka: string };

    try {
      title = JSON.parse(titleJson);
    } catch (error) {
      console.error('❌ Title parse error:', error);
      throw new BadRequestException('სათაურის JSON ფორმატი არასწორია');
    }

    try {
      description = descriptionJson
        ? JSON.parse(descriptionJson)
        : { en: '', ka: '' };
    } catch (error) {
      console.error('❌ Description parse error:', error);
      throw new BadRequestException('აღწერის JSON ფორმატი არასწორია');
    }

    if (!title.en || !title.ka) {
      throw new BadRequestException('სათაური ორივე ენაზე აუცილებელია');
    }

    const result = await this.travelService.createSlider(
      file,
      title,
      description,
    );
    console.log('✅ Slider created:', result.id);

    return result;
  }

  @Get()
  findAll() {
    console.log('📨 GET /api/v1/slider');
    return this.travelService.findAllSliders();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(`📨 GET /api/v1/slider/${id}`);
    return this.travelService.findOneSlider(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSliderDto: any) {
    console.log(`📨 PATCH /api/v1/slider/${id}`);
    return this.travelService.updateSlider(id, updateSliderDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    console.log(`📨 DELETE /api/v1/slider/${id}`);
    await this.travelService.deleteSlider(id);
    return { message: 'სლაიდერი წაიშალა' };
  }
}
