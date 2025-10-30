import { IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDestinationDto } from './create-destination.dto';

export class CreateToursServiceDto {
  @IsObject()
  title: { ka: string; en: string };

  @IsString()
  src: string;

  @IsObject()
  additionalDescription: { ka: string; en: string };

  @IsObject()
  region: { ka: string; en: string };

  @IsString()
  city: string;

  @IsString()
  link: string;

  @IsObject()
  description: { ka: string; en: string };

  @IsObject()
  name: { ka: string; en: string };

  @IsObject()
  address: { ka: string; en: string };

  @IsString()
  phone: string;

  @IsString()
  website: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDestinationDto)
  destinations: CreateDestinationDto[];
}
