// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// // import * as bodyParser from 'body-parser';
// import * as express from 'express';
// import * as path from 'path';
// import { json, urlencoded } from 'express';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api/v1');
//   app.enableCors();
//   // Validation-ის ჩართვა
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );
//   // app.use(bodyParser.json({ limit: '50mb' }));
//   // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//   app.use(json({ limit: '50mb' }));
//   app.use(urlencoded({ extended: true, limit: '50mb' }));
//   app.use(
//     '/uploads',
//     express.static(path.join(__dirname, '..', 'public', 'uploads')),
//   );
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

//   await app.listen(8000);
// }
// bootstrap();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-production-domain.com',
      'https://nest-travel-api-9x63.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📁 Static files served from: /uploads`);
}

bootstrap();
