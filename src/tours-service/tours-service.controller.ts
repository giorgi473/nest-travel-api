import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ToursServiceService } from './tours-service.service';
import { CreateToursServiceDto } from './dto/create-tours-service.dto';
import { UpdateToursServiceDto } from './dto/update-tours-service.dto';

@Controller('tours')
export class ToursServiceController {
  constructor(private readonly toursService: ToursServiceService) {}

  @Post()
  create(@Body() createToursServiceDto: CreateToursServiceDto) {
    return this.toursService.create(createToursServiceDto);
  }

  @Get()
  findAll(@Query('region') region?: string) {
    if (region) {
      return this.toursService.findByRegion(region);
    }
    return this.toursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateToursServiceDto: UpdateToursServiceDto,
  ) {
    return this.toursService.update(id, updateToursServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }
}
