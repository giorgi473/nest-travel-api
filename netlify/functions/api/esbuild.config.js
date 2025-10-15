const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['api.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'api.js',
  external: [
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'kafkajs',
    'mqtt',
    'nats',
    'ioredis',
    'amqplib',
    'amqp-connection-manager',
    '@nestjs/platform-socket.io',
  ],
}).catch(() => process.exit(1));