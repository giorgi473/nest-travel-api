// import { IsOptional, IsObject, IsString } from 'class-validator';

// export class UpdateSliderDto {
//   @IsOptional()
//   @IsString()
//   src?: string;

//   @IsOptional()
//   @IsObject()
//   title?: { en: string; ka: string };

//   @IsOptional()
//   @IsObject()
//   description?: { en: string; ka: string };
// }
import { PartialType } from '@nestjs/mapped-types';
import { CreateSliderDto } from './create-slider.dto';

export class UpdateSliderDto extends PartialType(CreateSliderDto) {}
