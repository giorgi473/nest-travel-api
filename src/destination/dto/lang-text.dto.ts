import { IsString, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LangText {
  @IsString()
  @IsOptional()
  ka?: string;

  @IsString()
  @IsOptional()
  en?: string;
}
