import { IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateSliderDto {
  @IsOptional()
  @IsString()
  src?: string;

  @IsOptional()
  @IsObject()
  title?: { en: string; ka: string };

  @IsOptional()
  @IsObject()
  description?: { en: string; ka: string };
}
