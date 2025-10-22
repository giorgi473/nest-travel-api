import { IsString, IsOptional } from 'class-validator';

export class WorkingHours {
  @IsString()
  @IsOptional()
  Monday?: string;

  @IsString()
  @IsOptional()
  Tuesday?: string;

  @IsString()
  @IsOptional()
  Wednesday?: string;

  @IsString()
  @IsOptional()
  Thursday?: string;

  @IsString()
  @IsOptional()
  Friday?: string;

  @IsString()
  @IsOptional()
  Saturday?: string;

  @IsString()
  @IsOptional()
  Sunday?: string;
}
