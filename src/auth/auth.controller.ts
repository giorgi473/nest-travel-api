import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  // @Post('change-password')
  // @UseGuards(JwtGuard)
  // changePassword(
  //   @Request() req,
  //   @Body() body: { oldPassword: string; newPassword: string },
  // ) {
  //   return this.authService.changePassword(
  //     req.user.sub,
  //     body.oldPassword,
  //     body.newPassword,
  //   );
  // }

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
}
