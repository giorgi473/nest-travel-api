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
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSliderDto {
  @IsNotEmpty({ message: 'სურათის base64 ფორმატი აუცილებელია' })
  @IsString({ message: 'src უნდა იყოს სტრიქონი' })
  src: string;

  @IsNotEmpty({ message: 'სათაური აუცილებელია' })
  @IsObject({ message: 'title უნდა იყოს ობიექტი { en: string, ka: string }' })
  title: { en: string; ka: string };

  @IsNotEmpty({ message: 'აღწერა აუცილებელია' })
  @IsObject({
    message: 'description უნდა იყოს ობიექტი { en: string, ka: string }',
  })
  description: { en: string; ka: string };
}
