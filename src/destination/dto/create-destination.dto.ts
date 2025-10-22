// import { IsString, ValidateNested, IsArray, IsOptional } from 'class-validator';
// import { Type } from 'class-transformer';

// export class LangText {
//   @IsString()
//   @IsOptional()
//   ka?: string;

//   @IsString()
//   @IsOptional()
//   en?: string;
// }

// export class WorkingHours {
//   @IsString()
//   @IsOptional()
//   Monday?: string;

//   @IsString()
//   @IsOptional()
//   Tuesday?: string;

//   @IsString()
//   @IsOptional()
//   Wednesday?: string;

//   @IsString()
//   @IsOptional()
//   Thursday?: string;

//   @IsString()
//   @IsOptional()
//   Friday?: string;

//   @IsString()
//   @IsOptional()
//   Saturday?: string;

//   @IsString()
//   @IsOptional()
//   Sunday?: string;
// }

// export class AnotherSection {
//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   name1?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description?: LangText;

//   @IsString()
//   @IsOptional()
//   image?: string;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   name2?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description2?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description3?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   name4?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   name5?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description4?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description5?: LangText;
// }

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

// export class CreateBlogDto {
//   @IsString()
//   @IsOptional()
//   img?: string;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   title?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   blogText?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   desc?: LangText;
// }

// export class CreateDestinationDto {
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
//   region?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   city?: LangText;

//   @ValidateNested()
//   @Type(() => LangText)
//   @IsOptional()
//   description?: LangText;

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

//   @ValidateNested()
//   @Type(() => AnotherSection)
//   @IsOptional()
//   anotherSection?: AnotherSection;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateSlideCardDto)
//   @IsOptional()
//   slideCard?: CreateSlideCardDto[];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateBlogDto)
//   @IsOptional()
//   blogs?: CreateBlogDto[];
// }
import { ValidateNested, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LangText } from './lang-text.dto';
import { WorkingHours } from './working-hours.dto';
import { AnotherSection } from './another-section.dto';
import { CreateSlideCardDto } from './create-slide-card.dto';
import { CreateBlogDto } from './create-blog.dto';

export class CreateDestinationDto {
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
  region?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  city?: LangText;

  @ValidateNested()
  @Type(() => LangText)
  @IsOptional()
  description?: LangText;

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
  @Type(() => CreateSlideCardDto)
  @IsOptional()
  slideCard?: CreateSlideCardDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogDto)
  @IsOptional()
  blogs?: CreateBlogDto[];
}
