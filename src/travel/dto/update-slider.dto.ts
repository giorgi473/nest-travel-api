// import { IsOptional, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// class LangText {
//   @IsOptional()
//   en?: string;

//   @IsOptional()
//   ka?: string;
// }

// export class UpdateSliderDto {
//   @IsOptional()
//   src?: string;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => LangText)
//   title?: LangText;

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => LangText)
//   description?: LangText;
// }
import { IsString, IsOptional } from 'class-validator';

export class UpdateSliderDto {
  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  titleKa?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionKa?: string;

  @IsString()
  @IsOptional()
  src?: string;
}
