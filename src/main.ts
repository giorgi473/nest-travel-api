// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as express from 'express';
// import * as path from 'path';
// import { json, urlencoded } from 'express';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   // const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   app.setGlobalPrefix('api/v1');
//   app.enableCors();

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: false,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//     }),
//   );

//   app.use(json({ limit: '50mb' }));
//   app.use(urlencoded({ extended: true, limit: '50mb' }));

//   app.enableCors({
//     origin: [
//       'http://localhost:3000',
//       'http://localhost:3001',
//       'https://your-production-domain.com',
//     ],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });

//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   await app.listen(8000);
// }
// bootstrap();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  // ✅ CORS Configuration - უნდა იყოს ValidationPipe-მდე
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://travel-website-25.netlify.app', // ✅ თქვენი frontend production domain
      'https://your-production-domain.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Body parser limits
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
}
bootstrap();
