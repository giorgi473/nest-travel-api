// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TravelService } from './travel.service';
// import { TravelController } from './travel.controller';
// import { Slider } from './entities/slider.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Slider])],
//   providers: [TravelService],
//   controllers: [TravelController],
// })
// export class TravelModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { Slider } from './entities/slider.entity';

@Module({
  imports: [
    // TypeORM-ის კონფიგურაცია
    TypeOrmModule.forFeature([Slider]),

    // Multer-ის კონფიგურაცია ფაილების ატვირთვისთვის
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, callback) => {
        // დაშვებული MIME types
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/svg+xml',
          'image/gif',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(
              `არადაშვებული ფაილის ტიპი: ${file.mimetype}. დაშვებულია: ${allowedMimeTypes.join(', ')}`,
            ),
            false,
          );
        }
      },
    }),
  ],
  controllers: [TravelController],
  providers: [TravelService],
  exports: [TravelService],
})
export class TravelModule {}
