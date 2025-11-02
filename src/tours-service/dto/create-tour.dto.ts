import {
  IsString,
  IsObject,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePopularTourDto {
  @IsObject()
  title: { ka: string; en: string };

  @IsString()
  image: string;

  @IsObject()
  description: { ka: string; en: string };

  @IsString()
  @IsOptional()
  mapLink?: string;
}

export class CreateCardDto {
  @IsObject()
  title: { ka: string; en: string };

  @IsString()
  image: string;

  @IsObject()
  description: { ka: string; en: string };

  @IsObject()
  duration: { ka: string; en: string };

  @IsObject()
  activities: { ka: string; en: string };

  @IsObject()
  currency: { ka: string; en: string };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePopularTourDto)
  @IsOptional()
  popularTours?: CreatePopularTourDto[];
}
