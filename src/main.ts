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

import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api/v1');

  // CORS must be before everything
  app.enableCors({
    origin: true, // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  logger.log('✅ CORS enabled');

  // Body parser with large limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  logger.log('✅ Body parser configured (50MB limit)');

  // Static files
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  logger.log(`✅ Static files serving from: ${uploadsPath}`);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Don't throw error, just remove
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  logger.log('✅ Global validation pipe configured');

  const port = process.env.PORT || 8000;
  await app.listen(port);

  logger.log(`🚀 Application running on: http://localhost:${port}/api/v1`);
  logger.log(`📁 Uploads accessible at: http://localhost:${port}/uploads`);
  logger.log(`🔍 Test endpoint: http://localhost:${port}/api/v1/slider`);
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
