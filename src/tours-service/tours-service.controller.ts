// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { ToursServiceService } from './tours-service.service';
// import { CreateToursServiceDto } from './dto/create-tours-service.dto';
// import { UpdateToursServiceDto } from './dto/update-tours-service.dto';

// @Controller('tours')
// export class ToursServiceController {
//   constructor(private readonly toursService: ToursServiceService) {}

//   @Post()
//   create(@Body() createToursServiceDto: CreateToursServiceDto) {
//     return this.toursService.create(createToursServiceDto);
//   }

//   @Get()
//   findAll(@Query('region') region?: string) {
//     if (region) {
//       return this.toursService.findByRegion(region);
//     }
//     return this.toursService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.toursService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateToursServiceDto: UpdateToursServiceDto,
//   ) {
//     return this.toursService.update(id, updateToursServiceDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.toursService.remove(id);
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ToursServiceService } from './tours-service.service';
import { CreateCardDto, CreatePopularTourDto } from './dto/create-tour.dto';
import { UpdateCardDto } from './dto/update-tours-service.dto';

@Controller('tours')
export class ToursServiceController {
  constructor(private readonly toursService: ToursServiceService) {}

  // 📌 CARD ENDPOINTS

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.toursService.createCard(createCardDto);
  }

  @Get()
  getAllCards() {
    return this.toursService.getAllCards();
  }

  @Get(':id')
  getCardById(@Param('id') id: number) {
    return this.toursService.getCardById(id);
  }

  @Put(':id')
  updateCard(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.toursService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  deleteCard(@Param('id') id: number) {
    return this.toursService.deleteCard(id);
  }

  // 📌 POPULAR TOUR ENDPOINTS

  @Post('cards/:cardId/tours')
  @HttpCode(HttpStatus.CREATED)
  createPopularTour(
    @Param('cardId') cardId: number,
    @Body() createTourDto: CreatePopularTourDto,
  ) {
    return this.toursService.createPopularTour(cardId, createTourDto);
  }

  @Get('cards/:cardId/tours')
  getPopularToursByCard(@Param('cardId') cardId: number) {
    return this.toursService.getPopularToursByCard(cardId);
  }

  @Put('tours/:tourId')
  updatePopularTour(
    @Param('tourId') tourId: number,
    @Body() updateTourDto: CreatePopularTourDto,
  ) {
    return this.toursService.updatePopularTour(tourId, updateTourDto);
  }

  @Delete('tours/:tourId')
  deletePopularTour(@Param('tourId') tourId: number) {
    return this.toursService.deletePopularTour(tourId);
  }

  // 📌 SEED ENDPOINT

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  seedDatabase() {
    const cardSliderImages = [
      // თქვენი მასივი აქ...
    ];
    return this.toursService.seedDatabase(cardSliderImages);
  }
}
