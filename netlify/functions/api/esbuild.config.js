// const esbuild = require('esbuild');

// esbuild.build({
//   entryPoints: ['api.ts'],
//   bundle: true,
//   platform: 'node',
//   target: 'node16', // Match your Node.js version
//   outfile: 'api.js',
//   external: [
//     '@grpc/grpc-js',
//     '@grpc/proto-loader',
//     'kafkajs',
//     'mqtt',
//     'typeorm',
//     'nats',
//     'ioredis',
//     'amqplib',
//     'amqp-connection-manager',
//     '@nestjs/platform-socket.io',
//   ],
// }).catch(() => process.exit(1));
const esbuild = require('esbuild');

// ეს სკრიპტი ქმნის ოპტიმიზებულ, პატარა 'api.js' ფაილს.
// 'external' მასივიდან გამორიცხული მოდულები (მაგ., typeorm, დრაივერები) 
// ავტომატურად იქნება გამოყენებული Netlify-ის მიერ node_modules-დან.
const entryFile = 'netlify/functions/api.ts'; // თქვენი ჰენდლერის ფაილი
const outputDir = 'dist';
const outFile = `${outputDir}/api.js`;

esbuild.build({
  entryPoints: [entryFile], 
  bundle: true,
  platform: 'node',
  target: 'node20', // დარწმუნდით, რომ ეს ემთხვევა Netlify-ის Node ვერსიას
  outfile: outFile,
  
  // 🔴 კრიტიკული: გამორიცხვა მძიმე დამოკიდებულებების, რათა შემცირდეს ზომა.
  external: [
    // მონაცემთა ბაზის დრაივერები (ყველაზე მძიმე ნაწილი)
    'pg', 
    'mysql', 
    'sqlite3', 
    'tedious',
    'oracledb',
    // NestJS-ის და Core მოდულები
    'typeorm',
    'class-transformer',
    'class-validator',
    // Microservices/Broker მოდულები
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@grpc/grpc-js',
    'kafkajs',
    'mqtt',
    'nats',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    // NestJS-ის და Express-ის ძირითადი დამოკიდებულებები
    '@nestjs/platform-express',
    '@nestjs/common',
    '@nestjs/core',
    'express', 
  ],
  loader: {
    '.ts': 'ts',
  },
  minify: true, // კოდის მინიფიცირება ზომის შესამცირებლად
  sourcemap: false,
}).then(() => {
  console.log(`✅ Esbuild complete: Optimized ${outFile} created.`);
}).catch((error) => {
  console.error('❌ Esbuild failed during bundling:', error);
  process.exit(1);
});
