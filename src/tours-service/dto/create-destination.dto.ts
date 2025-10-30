import { IsOptional, IsNumber, IsString, IsObject } from 'class-validator';

export class CreateDestinationDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsObject()
  title: { ka: string; en: string };

  @IsObject()
  description: { ka: string; en: string };

  @IsString()
  image: string;

  @IsObject()
  duration: { ka: string; en: string };

  @IsObject()
  activities: { ka: string; en: string };

  @IsObject()
  currency: { ka: string; en: string };
}
