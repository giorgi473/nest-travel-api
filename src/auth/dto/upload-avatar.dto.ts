import { IsString, IsOptional } from 'class-validator';

export class UploadAvatarDto {
  @IsString()
  avatarFile: string; // base64 ან URL
}
