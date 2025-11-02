import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursServiceService } from './tours-service.service';
import { ToursServiceController } from './tours-service.controller';
import { Card } from './entities/card.entity';
import { PopularTour } from './entities/popular-tour.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card, PopularTour]), CloudinaryModule],
  providers: [ToursServiceService],
  controllers: [ToursServiceController],
  exports: [ToursServiceService],
})
export class ToursServiceModule {}
