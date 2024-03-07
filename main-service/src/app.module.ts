import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TCP_BOOKS_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'GRPC_USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: ['userproto'],
          protoPath: [join(__dirname, 'protos/user.proto')],
          url: 'localhost:3002',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: 'TCP_BOOKS_SERVICE',
    //   useFactory: (/* configService: ConfigService */) => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.TCP,
    //       options: {
    //         port: 3001,
    //       },
    //     });
    //   },
    //   inject: [
    //     /* ConfigService */
    //   ],
    // },
  ],
})
export class AppModule {}
