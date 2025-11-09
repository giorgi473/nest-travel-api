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
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

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

    const user = this.userRepo.create({
      email,
      username,
      password: hashedPassword,
      isEmailVerified: false,
      avatarUrl: null,
      avatarPublicId: null,
    });

    await this.userRepo.save(user);

    const tokens = this.generateTokens(user.id, user.email);
    return {
      message: 'Registration successful',
      user: this.formatUserResponse(user),
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
      user: this.formatUserResponse(user),
      ...tokens,
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

    return this.formatUserResponse(user);
  }

  // 🖼️ UPLOAD/UPDATE AVATAR
  async uploadUserAvatar(userId: number, base64Image: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    try {
      // თუ ძველი avatar აქვს, წაშალე Cloudinary-დან
      if (user.avatarPublicId) {
        this.logger.log(`🗑️ Deleting old avatar: ${user.avatarPublicId}`);
        await this.cloudinaryService.deleteImage(user.avatarPublicId);
      }

      // Upload new avatar to Cloudinary
      this.logger.log(`📤 Uploading new avatar for user: ${userId}`);
      const { url, publicId } = await this.cloudinaryService.uploadImage(
        base64Image,
        `user-avatars/user-${userId}`,
      );

      // Update user in database
      user.avatarUrl = url;
      user.avatarPublicId = publicId;
      await this.userRepo.save(user);

      this.logger.log(`✅ Avatar updated successfully for user: ${userId}`);

      return {
        message: 'Avatar uploaded successfully',
        user: this.formatUserResponse(user),
      };
    } catch (error) {
      this.logger.error(`❌ Avatar upload failed: ${error.message}`);
      throw new BadRequestException(`Avatar upload failed: ${error.message}`);
    }
  }

  // 🗑️ DELETE AVATAR
  async deleteUserAvatar(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.avatarPublicId) {
      throw new BadRequestException('User has no avatar to delete');
    }

    try {
      this.logger.log(`🗑️ Deleting avatar: ${user.avatarPublicId}`);
      await this.cloudinaryService.deleteImage(user.avatarPublicId);

      user.avatarUrl = null;
      user.avatarPublicId = null;
      await this.userRepo.save(user);

      this.logger.log(`✅ Avatar deleted successfully`);

      return {
        message: 'Avatar deleted successfully',
        user: this.formatUserResponse(user),
      };
    } catch (error) {
      this.logger.error(`❌ Avatar deletion failed: ${error.message}`);
      throw new BadRequestException(`Avatar deletion failed: ${error.message}`);
    }
  }

  private formatUserResponse(user: User) {
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
