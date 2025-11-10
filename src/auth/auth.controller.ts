// import {
//   Controller,
//   Post,
//   Body,
//   UseGuards,
//   Request,
//   Get,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { LoginAuthDto } from './dto/login-auth.dto';
// import { JwtGuard } from './guards/jwt.guard';
// import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
// import { ChangePasswordDto } from './dto/change-password.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('register')
//   register(@Body() dto: CreateAuthDto) {
//     return this.authService.register(dto);
//   }

//   @Post('login')
//   login(@Body() dto: LoginAuthDto) {
//     return this.authService.login(dto);
//   }

//   @Post('refresh')
//   @UseGuards(RefreshJwtGuard)
//   refreshToken(@Request() req) {
//     return this.authService.refreshToken(req.user.sub);
//   }

//   @Post('change-password')
//   @UseGuards(JwtGuard)
//   changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
//     return this.authService.changePassword(
//       req.user.sub,
//       dto.oldPassword,
//       dto.newPassword,
//     );
//   }

//   @Get('me')
//   @UseGuards(JwtGuard)
//   getProfile(@Request() req) {
//     if (!req.user?.sub) {
//       throw new UnauthorizedException('No user in request');
//     }

//     return this.authService.validateUser(req.user.sub);
//   }
// }

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.sub);
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.sub,
      dto.oldPassword,
      dto.newPassword,
    );
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getProfile(@Request() req) {
    if (!req.user?.sub) {
      throw new UnauthorizedException('No user in request');
    }

    return this.authService.validateUser(req.user.sub);
  }

  // @Post('me/upload-avatar') // 🔴 დაემატა ნიუ endpoint
  // @UseGuards(JwtGuard)
  // uploadAvatar(@Request() req, @Body() dto: UploadAvatarDto) {
  //   return this.authService.uploadAvatar(req.user.sub, dto.avatarFile);
  // }

  @Post('me/upload-avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.authService.uploadAvatar(req.user.sub, file);
  }
}
