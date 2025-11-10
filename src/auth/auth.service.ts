// import {
//   Injectable,
//   BadRequestException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from './entities/user.entity';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { LoginAuthDto } from './dto/login-auth.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User) private userRepo: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async register(dto: CreateAuthDto) {
//     const { email, password, username } = dto;

//     const existingUser = await this.userRepo.findOne({ where: { email } });
//     if (existingUser) {
//       throw new BadRequestException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = this.userRepo.create({
//       email,
//       username,
//       password: hashedPassword,
//       isEmailVerified: false,
//     });

//     await this.userRepo.save(user);

//     const tokens = this.generateTokens(user.id, user.email);
//     return {
//       message: 'Registration successful',
//       user: { id: user.id, email: user.email, username: user.username },
//       ...tokens,
//     };
//   }

//   async login(dto: LoginAuthDto) {
//     const { email, password } = dto;

//     const user = await this.userRepo.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const tokens = this.generateTokens(user.id, user.email);
//     return {
//       message: 'Login successful',
//       user: { id: user.id, email: user.email, username: user.username },
//       ...tokens,
//     };
//   }

//   async refreshToken(userId: number) {
//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     const tokens = this.generateTokens(user.id, user.email);
//     return tokens;
//   }

//   async changePassword(
//     userId: number,
//     oldPassword: string,
//     newPassword: string,
//   ) {
//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     // ✅ დამატენი ეს ჩეკი
//     if (!user.password) {
//       throw new UnauthorizedException('User password not found in database');
//     }

//     // ✅ ასევე დაამატე ვალიდაცია oldPassword-ისთვის
//     if (!oldPassword || !newPassword) {
//       throw new BadRequestException(
//         'Old password and new password are required',
//       );
//     }

//     const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
//     if (!isPasswordValid) {
//       throw new BadRequestException('Old password is incorrect');
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await this.userRepo.save(user);

//     return { message: 'Password changed successfully' };
//   }

//   async validateUser(id: number) {
//     const user = await this.userRepo.findOne({ where: { id } });
//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }
//     // ✅ არ გააბრუნო პაროლი
//     const { password, ...result } = user;
//     return result;
//   }

//   private generateTokens(userId: number, email: string) {
//     const payload = { sub: userId, email };

//     const accessToken = this.jwtService.sign(payload, {
//       expiresIn: '15m',
//       secret: process.env.JWT_SECRET || 'secret',
//     });

//     const refreshToken = this.jwtService.sign(payload, {
//       expiresIn: '7d',
//       secret: process.env.JWT_SECRET || 'secret',
//     });

//     return { accessToken, refreshToken };
//   }
// }

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async register(dto: CreateAuthDto) {
    const { email, password, username } = dto;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = hashedPassword;
    user.isEmailVerified = false;
    user.avatar = null;
    user.avatarPublicId = null;

    await this.userRepo.save(user);

    const tokens = this.generateTokens(user.id, user.email);
    return {
      message: 'Registration successful',
      user: { id: user.id, email: user.email, username: user.username },
      ...tokens,
    };
  }

  async login(dto: LoginAuthDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.email);
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async uploadAvatar(userId: number, avatarFile: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.avatarPublicId) {
      try {
        await this.cloudinaryService.deleteImage(user.avatarPublicId);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error.message);
      }
    }

    const { url, publicId } = await this.cloudinaryService.uploadImage(
      avatarFile,
      'user-avatars',
    );

    user.avatar = url;
    user.avatarPublicId = publicId;
    await this.userRepo.save(user);

    return {
      message: 'Avatar uploaded successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    };
  }

  async refreshToken(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = this.generateTokens(user.id, user.email);
    return tokens;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('User password not found in database');
    }

    if (!oldPassword || !newPassword) {
      throw new BadRequestException(
        'Old password and new password are required',
      );
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password changed successfully' };
  }

  async validateUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET || 'secret',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET || 'secret',
    });

    return { accessToken, refreshToken };
  }
}
