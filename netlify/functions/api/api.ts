import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { AppModule } from 'src/app.module';

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: false },
    );
    await nestApp.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export async function handler(event, context) {
  const server = await bootstrapServer();
  return proxy(server, event, context);
}
