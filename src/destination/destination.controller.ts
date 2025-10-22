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
//   Inject,
// } from '@nestjs/common';
// import { DestinationService } from './destination.service';
// import { CreateDestinationDto } from './dto/create-destination.dto';
// import { UpdateDestinationDto } from './dto/update-destination.dto';

// @Controller('slider/destination')
// export class DestinationController {
//   constructor(
//     @Inject(DestinationService) private destinationService: DestinationService,
//   ) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(@Body() createDestinationDto: CreateDestinationDto) {
//     return this.destinationService.create(createDestinationDto);
//   }

//   @Get()
//   async findAll(@Query('lang') lang?: 'ka' | 'en') {
//     return this.destinationService.findAll(lang);
//   }

//   @Get(':id')
//   async findOne(
//     @Param('id', ParseIntPipe) id: number,
//     @Query('lang') lang?: 'ka' | 'en',
//   ) {
//     return this.destinationService.findOne(id, lang);
//   }

//   @Put(':id')
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDestinationDto: UpdateDestinationDto,
//   ) {
//     return this.destinationService.update(id, updateDestinationDto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.destinationService.remove(id);
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
  Inject,
} from '@nestjs/common';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('slider/destination')
export class DestinationController {
  constructor(
    @Inject(DestinationService) private destinationService: DestinationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationService.create(createDestinationDto);
  }

  @Get()
  async findAll(@Query('lang') lang?: 'ka' | 'en') {
    return this.destinationService.findAll(lang);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: 'ka' | 'en',
  ) {
    return this.destinationService.findOne(id, lang);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationService.update(id, updateDestinationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.destinationService.remove(id);
  }
}
