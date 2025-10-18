// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TravelService } from './travel.service';
// import { TravelController } from './travel.controller';
// import { Slider } from './entities/slider.entity';
// import { CloudinaryModule } from '../cloudinary/cloudinary.module';

// @Module({
//   imports: [TypeOrmModule.forFeature([Slider]), CloudinaryModule],
//   providers: [TravelService],
//   controllers: [TravelController],
//   exports: [TravelService],
// })
// export class TravelModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { Slider } from './entities/slider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider])],
  controllers: [TravelController],
  providers: [TravelService], // ✅ CloudinaryService წაშალეთ!
  exports: [TravelService],
})
export class TravelModule {}
