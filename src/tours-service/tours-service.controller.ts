// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { ToursServiceService } from './tours-service.service';
// import { CreateCardDto, CreatePopularTourDto } from './dto/create-tour.dto';
// import { UpdateCardDto } from './dto/update-tours-service.dto';

// @Controller('tours')
// export class ToursServiceController {
//   constructor(private readonly toursService: ToursServiceService) {}

//   // 📌 CARD ENDPOINTS

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   createCard(@Body() createCardDto: CreateCardDto) {
//     return this.toursService.createCard(createCardDto);
//   }

//   @Get()
//   getAllCards() {
//     return this.toursService.getAllCards();
//   }

//   @Get(':id')
//   getCardById(@Param('id') id: number) {
//     return this.toursService.getCardById(id);
//   }

//   @Put(':id')
//   updateCard(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
//     return this.toursService.updateCard(id, updateCardDto);
//   }

//   @Delete(':id')
//   deleteCard(@Param('id') id: number) {
//     return this.toursService.deleteCard(id);
//   }

//   // 📌 POPULAR TOUR ENDPOINTS

//   @Post('cards/:cardId/tours')
//   @HttpCode(HttpStatus.CREATED)
//   createPopularTour(
//     @Param('cardId') cardId: number,
//     @Body() createTourDto: CreatePopularTourDto,
//   ) {
//     return this.toursService.createPopularTour(cardId, createTourDto);
//   }

//   @Get('cards/:cardId/tours')
//   getPopularToursByCard(@Param('cardId') cardId: number) {
//     return this.toursService.getPopularToursByCard(cardId);
//   }

//   @Put('tours/:tourId')
//   updatePopularTour(
//     @Param('tourId') tourId: number,
//     @Body() updateTourDto: CreatePopularTourDto,
//   ) {
//     return this.toursService.updatePopularTour(tourId, updateTourDto);
//   }

//   @Delete('tours/:tourId')
//   deletePopularTour(@Param('tourId') tourId: number) {
//     return this.toursService.deletePopularTour(tourId);
//   }

//   // 📌 SEED ENDPOINT

//   @Post('seed')
//   @HttpCode(HttpStatus.CREATED)
//   seedDatabase() {
//     const cardSliderImages = [
//       // თქვენი მასივი აქ...
//     ];
//     return this.toursService.seedDatabase(cardSliderImages);
//   }
// }
// tours-service.controller.ts
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
  Logger,
} from '@nestjs/common';
import { ToursServiceService } from './tours-service.service';
import { CreateCardDto, CreatePopularTourDto } from './dto/create-tour.dto';
import { UpdateCardDto } from './dto/update-tours-service.dto';

@Controller('api/v1/tours')
export class ToursServiceController {
  private readonly logger = new Logger(ToursServiceController.name);

  constructor(private readonly toursService: ToursServiceService) {}

  // 📌 CARD ENDPOINTS

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCard(@Body() createCardDto: CreateCardDto) {
    this.logger.log('📨 POST /tours - Creating new card with popular tours');
    return await this.toursService.createCard(createCardDto);
  }

  @Get()
  async getAllCards() {
    return await this.toursService.getAllCards();
  }

  @Get(':id')
  async getCardById(@Param('id') id: number) {
    return await this.toursService.getCardById(id);
  }

  @Put(':id')
  async updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    this.logger.log(`📨 PUT /tours/${id} - Updating card`);
    return await this.toursService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: number) {
    return await this.toursService.deleteCard(id);
  }

  // 📌 POPULAR TOUR ENDPOINTS

  @Post('cards/:cardId/tours')
  @HttpCode(HttpStatus.CREATED)
  async createPopularTour(
    @Param('cardId') cardId: number,
    @Body() createTourDto: CreatePopularTourDto,
  ) {
    this.logger.log(
      `📨 POST /tours/cards/${cardId}/tours - Creating popular tour`,
    );
    return await this.toursService.createPopularTour(cardId, createTourDto);
  }

  @Get('cards/:cardId/tours')
  async getPopularToursByCard(@Param('cardId') cardId: number) {
    return await this.toursService.getPopularToursByCard(cardId);
  }

  @Put('tours/:tourId')
  async updatePopularTour(
    @Param('tourId') tourId: number,
    @Body() updateTourDto: CreatePopularTourDto,
  ) {
    this.logger.log(`📨 PUT /tours/tours/${tourId} - Updating popular tour`);
    return await this.toursService.updatePopularTour(tourId, updateTourDto);
  }

  @Delete('tours/:tourId')
  async deletePopularTour(@Param('tourId') tourId: number) {
    this.logger.log(`📨 DELETE /tours/tours/${tourId} - Deleting popular tour`);
    return await this.toursService.deletePopularTour(tourId);
  }

  // 📌 SEED ENDPOINT

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  async seedDatabase() {
    const cardSliderImages: CreateCardDto[] = [
      // თქვენი მასივი აქ...
    ];
    return await this.toursService.seedDatabase(cardSliderImages);
  }
}

