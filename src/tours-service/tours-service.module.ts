import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursServiceService } from './tours-service.service';
import { ToursServiceController } from './tours-service.controller';
import { ToursServiceEntity } from './entities/tours-service.entity';
import { DestinationEntity } from './entities/destination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ToursServiceEntity, DestinationEntity])],
  controllers: [ToursServiceController],
  providers: [ToursServiceService],
})
export class ToursServiceModule {}
