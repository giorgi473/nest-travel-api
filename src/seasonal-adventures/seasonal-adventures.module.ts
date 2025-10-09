import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonalAdventuresController } from './seasonal-adventures.controller';
import { SeasonalAdventuresService } from './seasonal-adventures.service';
import { SeasonalAdventure } from './entities/seasonal-adventure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonalAdventure])],
  controllers: [SeasonalAdventuresController],
  providers: [SeasonalAdventuresService],
  exports: [SeasonalAdventuresService],
})
export class SeasonalAdventuresModule {}
