// import { ValidateNested, IsOptional, IsString, IsArray } from 'class-validator';
// import { Type } from 'class-transformer';
// import { LangText } from './lang-text.dto';
// import { WorkingHours } from './working-hours.dto';

// export class CreateSlideCardDto {
//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   title?: LangText;

//   @IsString()
//   @IsOptional()
//   src?: string;

//   @IsString()
//   @IsOptional()
//   modalSrc?: string;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   additionalDescription?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   text?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   region?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   city?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   name?: LangText;

//   @IsString()
//   @IsOptional()
//   address?: string;

//   @IsString()
//   @IsOptional()
//   phone?: string;

//   @IsString()
//   @IsOptional()
//   website?: string;

//   @ValidateNested()
//   @Type(() => WorkingHours)
//   @IsOptional()
//   workingHours?: WorkingHours;
// }
import { ValidateNested, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LangText } from './lang-text.dto';
import { WorkingHours } from './working-hours.dto';
import { AnotherSection } from './another-section.dto';
import { CreateBlogDto } from './create-blog.dto';

export class CreateSlideCardDto {
  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  title?: LangText;

  @IsString()
  @IsOptional()
  src?: string;

  @IsString()
  @IsOptional()
  modalSrc?: string;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  additionalDescription?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  text?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  region?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  city?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  name?: LangText;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @ValidateNested()
  @Type(() => WorkingHours)
  @IsOptional()
  workingHours?: WorkingHours;

  @ValidateNested()
  @Type(() => AnotherSection)
  @IsOptional()
  anotherSection?: AnotherSection;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogDto)
  @IsOptional()
  blogs?: CreateBlogDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlideCardDto)
  @IsOptional()
  slideCard?: CreateSlideCardDto[];
}
