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
//   ],
//   controllers: [AppController, DestinationController, TravelController],
//   providers: [AppService, TravelService],
// })
// export class AppModule {}
import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TravelModule } from './travel/travel.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true, // Enable all SQL logging
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),

    TravelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('✅ AppModule initialized');
  }
}
