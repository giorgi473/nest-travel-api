// import { IsNotEmpty, IsObject, IsString } from 'class-validator';

// export class CreateSliderDto {
//   @IsNotEmpty({ message: 'სურათის base64 ფორმატი აუცილებელია' })
//   @IsString({ message: 'src უნდა იყოს სტრიქონი' })
//   src: string;

//   @IsNotEmpty({ message: 'სათაური აუცილებელია' })
//   @IsObject({ message: 'title უნდა იყოს ობიექტი { en: string, ka: string }' })
//   title: { en: string; ka: string };

//   @IsNotEmpty({ message: 'აღწერა აუცილებელია' })
//   @IsObject({
//     message: 'description უნდა იყოს ობიექტი { en: string, ka: string }',
//   })
//   description: { en: string; ka: string };
// }
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LangText {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ka: string;
}

export class CreateSliderDto {
  @IsNotEmpty({ message: 'სურათის base64 ფორმატი აუცილებელია' })
  @IsString({ message: 'src უნდა იყოს სტრიქონი' })
  src: string;

  @IsNotEmpty({ message: 'სათაური აუცილებელია' })
  @ValidateNested()
  @Type(() => LangText)
  title: LangText;

  @IsNotEmpty({ message: 'აღწერა აუცილებელია' })
  @ValidateNested()
  @Type(() => LangText)
  description: LangText;
}
