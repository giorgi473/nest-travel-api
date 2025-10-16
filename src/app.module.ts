// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { TravelModule } from './travel/travel.module';
// import { DestinationController } from './destination/destination.controller';
// import { DestinationModule } from './destination/destination.module';
// import { SeasonalAdventuresModule } from './seasonal-adventures/seasonal-adventures.module';
// import { GeorgianGastronomyModule } from './georgian-gastronomy/georgian-gastronomy.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
// import { TravelService } from './travel/travel.service';
// import { Slider } from './travel/entities/slider.entity';
// import { TravelController } from './travel/travel.controller';
// import { CloudinaryService } from './cloudinary/cloudinary.service';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: process.env.DATABASE_URL,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       autoLoadEntities: true,
//       synchronize: true,
//       ssl: { rejectUnauthorized: false },
//     }),
//     TypeOrmModule.forFeature([Slider]),
//     ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '..', 'uploads'),
//       serveRoot: '/uploads',
//     }),
//     TravelModule,
//     DestinationModule,
//     SeasonalAdventuresModule,
//     GeorgianGastronomyModule,
//     CloudinaryModule,
//   ],
//   controllers: [AppController, DestinationController, TravelController],
//   providers: [AppService, TravelService, CloudinaryService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TravelModule } from './travel/travel.module';
import { DestinationModule } from './destination/destination.module';
import { SeasonalAdventuresModule } from './seasonal-adventures/seasonal-adventures.module';
import { GeorgianGastronomyModule } from './georgian-gastronomy/georgian-gastronomy.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // synchronize: true,
      // ssl: { rejectUnauthorized: false },
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ Production-ში false!
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    TravelModule, // ← შიგნით არის TravelController და TravelService
    DestinationModule, // ← შიგნით არის DestinationController და Service
    SeasonalAdventuresModule,
    GeorgianGastronomyModule,
    CloudinaryModule, // ← შიგნით არის CloudinaryService
  ],
  controllers: [AppController], // ← მხოლოდ root controller
  providers: [AppService], // ← მხოლოდ root service
})
export class AppModule {}
