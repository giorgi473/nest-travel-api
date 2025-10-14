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
