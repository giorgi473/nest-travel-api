import { IsString, IsOptional } from 'class-validator';

export class LangText {
  @IsString()
  @IsOptional()
  ka?: string;

  @IsString()
  @IsOptional()
  en?: string;
}
