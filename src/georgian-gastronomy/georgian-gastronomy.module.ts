// georgian-gastronomy.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeorgianGastronomyController } from './georgian-gastronomy.controller';
import { GeorgianGastronomyService } from './georgian-gastronomy.service';
import { Dish } from './entities/georgian-gastronomy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [GeorgianGastronomyController],
  providers: [GeorgianGastronomyService],
  exports: [GeorgianGastronomyService],
})
export class GeorgianGastronomyModule {}
