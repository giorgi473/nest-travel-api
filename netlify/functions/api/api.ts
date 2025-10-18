// import 'reflect-metadata';
// import { NestFactory } from '@nestjs/core';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express, { Express } from 'express';
// import { AppModule } from 'src/app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { json, urlencoded } from 'express';
// import { HandlerEvent, HandlerContext } from '@netlify/functions';

// let cachedApp: Express | null = null;

// async function bootstrap(): Promise<Express> {
//   if (cachedApp) {
//     return cachedApp;
//   }

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
//         'http://localhost:8888', // Netlify Dev
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

//     cachedApp = expressApp;
//     return expressApp;
//   } catch (error) {
//     console.error('❌ Failed to initialize NestJS app:', error);
//     throw error;
//   }
// }

// export const handler = async (event: HandlerEvent, context: HandlerContext) => {
//   try {
//     const app = await bootstrap();

//     // Netlify event-ის გარდაქმნა Express request-ად
//     return new Promise((resolve, reject) => {
//       const { httpMethod, path, headers, body, queryStringParameters } = event;

//       // Query string-ის აწყობა
//       const queryString = queryStringParameters
//         ? '?' +
//           new URLSearchParams(
//             queryStringParameters as Record<string, string>,
//           ).toString()
//         : '';

//       // Request ობიექტის შექმნა
//       const req: any = {
//         method: httpMethod,
//         url: path + queryString,
//         headers: headers || {},
//         body: body,
//         // Express-ისთვის საჭირო დამატებითი properties
//         query: queryStringParameters || {},
//         params: {},
//         get: function (name: string) {
//           return this.headers[name.toLowerCase()];
//         },
//       };

//       // Response ობიექტის შექმნა
//       const res: any = {
//         statusCode: 200,
//         _headers: {},
//         _body: [],

//         status(code: number) {
//           this.statusCode = code;
//           return this;
//         },

//         setHeader(key: string, value: string) {
//           this._headers[key.toLowerCase()] = value;
//           return this;
//         },

//         getHeader(key: string) {
//           return this._headers[key.toLowerCase()];
//         },

//         removeHeader(key: string) {
//           delete this._headers[key.toLowerCase()];
//           return this;
//         },

//         write(chunk: any) {
//           this._body.push(chunk);
//           return this;
//         },

//         end(body?: any) {
//           if (body) {
//             this._body.push(body);
//           }

//           const responseBody = Buffer.concat(
//             this._body.map((b) => (Buffer.isBuffer(b) ? b : Buffer.from(b))),
//           ).toString();

//           resolve({
//             statusCode: this.statusCode,
//             headers: this._headers,
//             body: responseBody,
//           });
//         },

//         json(data: any) {
//           this.setHeader('content-type', 'application/json');
//           this.end(JSON.stringify(data));
//           return this;
//         },

//         send(body: any) {
//           if (typeof body === 'object') {
//             return this.json(body);
//           }
//           this.end(body);
//           return this;
//         },
//       };

//       // Express app-ის გამოძახება
//       app(req as any, res as any);
//     });
//   } catch (error) {
//     console.error('❌ Handler execution failed:', error);
//     return {
//       statusCode: 500,
//       headers: {
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: 'Server execution failed',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       }),
//     };
//   }
// };
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { HandlerEvent, HandlerContext } from '@netlify/functions';

// ლოგირება bootstrap-ისთვის
console.log('--- NestJS Function Startup ---');

let cachedApp: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cachedApp) {
    console.log('✅ NestJS app is already cached.');
    return cachedApp;
  }

  const expressApp = express();

  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'], // სრული ლოგირება
      },
    );

    app.setGlobalPrefix('api/v1');

    // CORS Configuration
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8888', // Netlify Dev
        'https://your-production-domain.com', // ❗ შეცვალეთ თქვენი დომენით
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
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Body Parsers (ლიმიტი 50mb - საჭიროა Base64 სურათებისთვის)
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    await app.init();

    console.log('✅ NestJS app initialized successfully and cached.');

    cachedApp = expressApp;
    return expressApp;
  } catch (error) {
    // ❗ ეს კრიტიკული ნაწილია 502-ის დიაგნოზისთვის
    console.error(
      '❌ Failed to initialize NestJS app (CRASH POINT):',
      error.message || error,
    );
    // ვცდილობთ, რომ შეცდომა არ მოვკლათ, არამედ დავლოგოთ და გადავაგდოთ
    throw new Error('NESTJS_INIT_FAILURE: Check function logs for details.');
  }
}

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const app = await bootstrap(); // Express აპლიკაცია

    // ------------------------------------------------------------------
    // ❗❗❗ კრიტიკული ნაწილი: Body-ის დეშიფრაცია Netlify-ისათვის ❗❗❗
    // ------------------------------------------------------------------
    const {
      httpMethod,
      path,
      headers,
      body,
      queryStringParameters,
      isBase64Encoded,
    } = event;

    let rawBody = body;
    // თუ Body არსებობს და არის Base64-ით დაშიფრული (რაც ხდება POST/PUT მოთხოვნებზე)
    if (rawBody && isBase64Encoded) {
      // ვშიფრავთ Base64 სტრინგს RAW JSON სტრინგად
      try {
        rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
      } catch (err) {
        console.warn('⚠️ Failed to decode Base64 body.', err);
      }
    }
    // ------------------------------------------------------------------

    return new Promise((resolve) => {
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
        body: rawBody, // ✅ გადავეცით RAW სტრინგი (ან გაშიფრული)
        query: queryStringParameters || {},
        params: {},
        // Header get მეთოდის უზრუნველყოფა
        get: function (name: string) {
          return this.headers[name.toLowerCase()];
        },
      };

      // Response ობიექტის შექმნა (რომელიც Express-ის პასუხს Netlify-ის ფორმატში გადაიყვანს)
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

        // ... (json და send მეთოდები უცვლელია)

        json(data: any) {
          this.setHeader('content-type', 'application/json');
          this.end(JSON.stringify(data));
          return this;
        },

        send(body: any) {
          if (typeof body === 'object' && !Buffer.isBuffer(body)) {
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
    // ❗ თუ handler-ის შესრულება ჩავარდება
    console.error('❌ Handler execution failed:', error.message || error);
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message:
          'Server execution failed. Check function logs for NESTJS_INIT_FAILURE.',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
