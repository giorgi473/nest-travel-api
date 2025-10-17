const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['api.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16', // Match your Node.js version
  outfile: 'api.js',
  external: [
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'kafkajs',
    'mqtt',
    'typeorm',
    'nats',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    '@nestjs/platform-socket.io',
  ],
}).catch(() => process.exit(1));
