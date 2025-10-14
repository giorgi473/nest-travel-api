// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TravelService } from './travel.service';
// import { TravelController } from './travel.controller';
// import { Slider } from './entities/slider.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Slider])],
//   providers: [TravelService],
//   controllers: [TravelController],
// })
// export class TravelModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { Slider } from './entities/slider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  controllers: [TravelController],
  providers: [TravelService],
  exports: [TravelService],
})
export class TravelModule {}
