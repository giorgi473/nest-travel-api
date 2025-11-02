// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ToursServiceService } from './tours-service.service';
// import { ToursServiceController } from './tours-service.controller';
// import { ToursServiceEntity } from './entities/tours-service.entity';
// import { DestinationEntity } from './entities/destination.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([ToursServiceEntity, DestinationEntity])],
//   controllers: [ToursServiceController],
//   providers: [ToursServiceService],
// })
// export class ToursServiceModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursServiceService } from './tours-service.service';
import { ToursServiceController } from './tours-service.controller';
import { Card } from './entities/card.entity';
import { PopularTour } from './entities/popular-tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, PopularTour])],
  providers: [ToursServiceService],
  controllers: [ToursServiceController],
  exports: [ToursServiceService],
})
export class ToursServiceModule {}
