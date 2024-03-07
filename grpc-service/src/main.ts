import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'userproto',
        protoPath: join(__dirname, 'protos/user.proto'),
        url: 'localhost:3002', // 'localhost:5000' is default
      },
    },
  );
  app
    .listen()
    .then(() => Logger.verbose('GRPC Service is listening on port 3002'));
}
bootstrap();
