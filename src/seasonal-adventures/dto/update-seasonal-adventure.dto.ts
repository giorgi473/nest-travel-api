import { PartialType } from '@nestjs/mapped-types';
import { CreateSeasonalAdventureDto } from './create-seasonal-adventure.dto';

export class UpdateSeasonalAdventureDto extends PartialType(
  CreateSeasonalAdventureDto,
) {}
