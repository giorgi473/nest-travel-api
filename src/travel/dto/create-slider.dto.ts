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
