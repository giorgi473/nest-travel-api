import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LangText {
  @IsString()
  @IsNotEmpty()
  ka: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

export class CreateSliderDto {
  @IsString()
  @IsNotEmpty()
  src: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LangText)
  title: LangText;

  @IsObject()
  @ValidateNested()
  @Type(() => LangText)
  description: LangText;
}
