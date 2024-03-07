import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        // urls: ['amqp://localhost:5672'],
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'demo_queue',
        // noAck: false, // If false, manual acknowledgment mode enabled
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen().then(() => Logger.verbose('RabbitMQ Service is listening'));
}
bootstrap();
