// dto/localized-text.dto.ts
import { IsString } from 'class-validator';

export class LocalizedTextDto {
  @IsString()
  ka: string;

  @IsString()
  en: string;
}
