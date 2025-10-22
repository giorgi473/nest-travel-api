import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LangText } from './lang-text.dto';

export class CreateBlogDto {
  @IsString()
  @IsOptional()
  img?: string;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  title?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  blogText?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  desc?: LangText;
}
