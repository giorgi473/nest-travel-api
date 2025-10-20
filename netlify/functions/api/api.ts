import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import serverless from 'serverless-http';

console.log('--- NestJS Function Startup (using serverless-http) ---');

type ServerlessHandler = (event: any, context: any) => Promise<any>;

let cachedServerlessHandler: ServerlessHandler | null = null;

async function bootstrap(): Promise<ServerlessHandler> {
  if (cachedServerlessHandler) {
    console.log('✅ Serverless handler is already cached.');
    return cachedServerlessHandler;
  }

  const expressApp = express();

  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn', 'log'] },
    );

    app.setGlobalPrefix('api/v1');

    // ✅ CORS Configuration - დამატებულია frontend domain
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8888',
        'https://travel-api-25.netlify.app',
        'https://travel-website-25.netlify.app', // ✅ Frontend production domain
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // Body Parsers
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    await app.init();

    console.log('✅ NestJS app initialized successfully.');

    const handler = serverless(expressApp) as ServerlessHandler;
    cachedServerlessHandler = handler;
    return handler;
  } catch (error) {
    console.error('❌ Failed to initialize NestJS app (CRASH POINT):', error);
    throw error;
  }
}

export const handler = async (event: any, context: any) => {
  try {
    const serverlessHandler = await bootstrap();
    return serverlessHandler(event, context);
  } catch (error) {
    console.error('❌ Final Handler execution failed:', error);
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*', // ✅ Fallback CORS
      },
      body: JSON.stringify({
        message:
          'Server execution failed during bootstrap. Check function logs.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
