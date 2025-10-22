import { ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { LangText } from './lang-text.dto';

export class AnotherSection {
  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  name1?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description?: LangText;

  @IsString()
  @IsOptional()
  image?: string;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  name2?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description2?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description3?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  name4?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  name5?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description4?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description5?: LangText;
}
