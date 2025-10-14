import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LangText {
  @IsOptional()
  en?: string;

  @IsOptional()
  ka?: string;
}

export class UpdateSliderDto {
  @IsOptional()
  src?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LangText)
  title?: LangText;

  @IsOptional()
  @ValidateNested()
  @Type(() => LangText)
  description?: LangText;
}
