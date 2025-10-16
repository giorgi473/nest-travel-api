// import 'reflect-metadata';
// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';
// import { createServer, proxy } from 'aws-serverless-express';
// import { AppModule } from 'src/app.module';

// let cachedServer;

// async function bootstrapServer() {
//   if (!cachedServer) {
//     const expressApp = express();
//     const nestApp = await NestFactory.create(
//       AppModule,
//       new ExpressAdapter(expressApp),
//       { logger: false },
//     );
//     await nestApp.init();
//     cachedServer = createServer(expressApp);
//   }
//   return cachedServer;
// }

// export async function handler(event, context) {
//   const server = await bootstrapServer();
//   return proxy(server, event, context);
// }

// -------------------------------------

// import 'reflect-metadata';
// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express, { Express } from 'express';
// import serverless from 'serverless-http';
// import { AppModule } from 'src/app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { json, urlencoded } from 'express';

// let cachedHandler;

// async function bootstrap(): Promise<Express> {
//   const expressApp = express();

//   try {
//     const app = await NestFactory.create(
//       AppModule,
//       new ExpressAdapter(expressApp),
//       { logger: ['error', 'warn', 'log'] },
//     );

//     app.setGlobalPrefix('api/v1');

//     app.enableCors({
//       origin: [
//         'http://localhost:3000',
//         'http://localhost:3001',
//         'https://your-production-domain.com',
//       ],
//       methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//       credentials: true,
//       allowedHeaders: ['Content-Type', 'Authorization'],
//     });

//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//         forbidNonWhitelisted: false,
//         transform: true,
//         transformOptions: {
//           enableImplicitConversion: true,
//         },
//       }),
//     );

//     app.use(json({ limit: '50mb' }));
//     app.use(urlencoded({ extended: true, limit: '50mb' }));

//     await app.init();

//     console.log('✅ NestJS app initialized successfully');

//     return expressApp;
//   } catch (error) {
//     console.error('❌ Failed to initialize NestJS app:', error);
//     throw error;
//   }
// }

// export const handler = async (event, context) => {
//   if (!cachedHandler) {
//     try {
//       const expressApp = await bootstrap();
//       cachedHandler = serverless(expressApp);
//       console.log('✅ Serverless handler created');
//     } catch (error) {
//       console.error('❌ Handler initialization failed:', error);
//       return {
//         statusCode: 500,
//         body: JSON.stringify({
//           message: 'Server initialization failed',
//           error: error.message,
//         }),
//       };
//     }
//   }

//   return cachedHandler(event, context);
// };

// -----------------------------------------

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { HandlerEvent, HandlerContext } from '@netlify/functions';

let cachedApp: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();

  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn', 'log'] },
    );

    app.setGlobalPrefix('api/v1');

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8888', // Netlify Dev
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

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    await app.init();

    console.log('✅ NestJS app initialized successfully');

    cachedApp = expressApp;
    return expressApp;
  } catch (error) {
    console.error('❌ Failed to initialize NestJS app:', error);
    throw error;
  }
}

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const app = await bootstrap();

    // Netlify event-ის გარდაქმნა Express request-ად
    return new Promise((resolve, reject) => {
      const { httpMethod, path, headers, body, queryStringParameters } = event;

      // Query string-ის აწყობა
      const queryString = queryStringParameters
        ? '?' +
          new URLSearchParams(
            queryStringParameters as Record<string, string>,
          ).toString()
        : '';

      // Request ობიექტის შექმნა
      const req: any = {
        method: httpMethod,
        url: path + queryString,
        headers: headers || {},
        body: body,
        // Express-ისთვის საჭირო დამატებითი properties
        query: queryStringParameters || {},
        params: {},
        get: function (name: string) {
          return this.headers[name.toLowerCase()];
        },
      };

      // Response ობიექტის შექმნა
      const res: any = {
        statusCode: 200,
        _headers: {},
        _body: [],

        status(code: number) {
          this.statusCode = code;
          return this;
        },

        setHeader(key: string, value: string) {
          this._headers[key.toLowerCase()] = value;
          return this;
        },

        getHeader(key: string) {
          return this._headers[key.toLowerCase()];
        },

        removeHeader(key: string) {
          delete this._headers[key.toLowerCase()];
          return this;
        },

        write(chunk: any) {
          this._body.push(chunk);
          return this;
        },

        end(body?: any) {
          if (body) {
            this._body.push(body);
          }

          const responseBody = Buffer.concat(
            this._body.map((b) => (Buffer.isBuffer(b) ? b : Buffer.from(b))),
          ).toString();

          resolve({
            statusCode: this.statusCode,
            headers: this._headers,
            body: responseBody,
          });
        },

        json(data: any) {
          this.setHeader('content-type', 'application/json');
          this.end(JSON.stringify(data));
          return this;
        },

        send(body: any) {
          if (typeof body === 'object') {
            return this.json(body);
          }
          this.end(body);
          return this;
        },
      };

      // Express app-ის გამოძახება
      app(req as any, res as any);
    });
  } catch (error) {
    console.error('❌ Handler execution failed:', error);
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Server execution failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
