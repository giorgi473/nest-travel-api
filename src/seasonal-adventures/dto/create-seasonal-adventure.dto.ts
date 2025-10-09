import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LangText {
  @IsString()
  @IsOptional()
  ka?: string;

  @IsString()
  @IsOptional()
  en?: string;
}

export class CreateSeasonalAdventureDto {
  @IsString()
  @IsOptional()
  image?: string;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  title?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  header?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  headerDescription?: LangText;
}
