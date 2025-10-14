import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { Slider } from './entities/slider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  providers: [TravelService],
  controllers: [TravelController],
})
export class TravelModule {}
