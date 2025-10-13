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
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TravelService } from './travel.service';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Controller('api/v1/slider')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  /**
   * ახალი სლაიდერის შექმნა
   * POST /api/v1/slider
   * Body: FormData { file, title (JSON string), description (JSON string) }
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async createSlider(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') titleJson: string,
    @Body('description') descriptionJson: string,
  ) {
    console.log('📨 POST /api/v1/slider - Creating new slider');

    // ვალიდაცია
    if (!file) {
      throw new BadRequestException('ფაილი აუცილებელია');
    }

    if (!titleJson) {
      throw new BadRequestException('სათაური აუცილებელია');
    }

    // JSON parse
    let title: { en: string; ka: string };
    let description: { en: string; ka: string };

    try {
      title = JSON.parse(titleJson);
    } catch (error) {
      throw new BadRequestException('სათაურის JSON ფორმატი არასწორია');
    }

    try {
      description = descriptionJson
        ? JSON.parse(descriptionJson)
        : { en: '', ka: '' };
    } catch (error) {
      throw new BadRequestException('აღწერის JSON ფორმატი არასწორია');
    }

    // შემოწმება
    if (!title.en || !title.ka) {
      throw new BadRequestException('სათაური ორივე ენაზე აუცილებელია');
    }

    return this.travelService.createSlider(file, title, description);
  }

  /**
   * ყველა სლაიდერის მოძიება
   * GET /api/v1/slider
   */
  @Get()
  async findAllSliders() {
    console.log('📨 GET /api/v1/slider - Fetching all sliders');
    return this.travelService.findAllSliders();
  }

  /**
   * ერთი სლაიდერის მოძიება
   * GET /api/v1/slider/:id
   */
  @Get(':id')
  async findOneSlider(@Param('id', ParseIntPipe) id: number) {
    console.log(`📨 GET /api/v1/slider/${id} - Fetching slider`);
    return this.travelService.findOneSlider(id);
  }

  /**
   * სლაიდერის განახლება
   * PATCH /api/v1/slider/:id
   */
  @Patch(':id')
  async updateSlider(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSliderDto: UpdateSliderDto,
  ) {
    console.log(`📨 PATCH /api/v1/slider/${id} - Updating slider`);
    return this.travelService.updateSlider(id, updateSliderDto);
  }

  /**
   * სლაიდერის წაშლა
   * DELETE /api/v1/slider/:id
   */
  @Delete(':id')
  async deleteSlider(@Param('id', ParseIntPipe) id: number) {
    console.log(`📨 DELETE /api/v1/slider/${id} - Deleting slider`);
    await this.travelService.deleteSlider(id);
    return { message: 'სლაიდერი წარმატებით წაიშალა' };
  }

  /**
   * ენის მიხედვით განახლება
   * PATCH /api/v1/slider/:id/language
   */
  @Patch(':id/language')
  async updateSliderLanguage(
    @Param('id', ParseIntPipe) id: number,
    @Body('lang') lang: 'ka' | 'en',
    @Body('field') field: 'title' | 'description',
    @Body('value') value: string,
  ) {
    console.log(
      `📨 PATCH /api/v1/slider/${id}/language - Updating ${field} (${lang})`,
    );
    return this.travelService.updateSliderLanguage(id, lang, field, value);
  }

  /**
   * სლაიდერების რაოდენობის შემოწმება
   * GET /api/v1/slider/count/info
   */
  @Get('count/info')
  async getSlidersCount() {
    console.log('📨 GET /api/v1/slider/count/info - Getting slider count');
    return this.travelService.getSlidersCount();
  }
}
