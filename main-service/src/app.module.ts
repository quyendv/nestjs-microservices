import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: 'TCP_BOOKS_SERVICE',
    //   useFactory: () => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.TCP,
    //       options: {
    //         port: 3001,
    //       },
    //     });
    //   },
    //   inject: [],
    //   // useFactory: (configService: ConfigService) => {
    //   //   const mathSvcOptions = configService.getMathSvcOptions();
    //   //   return ClientProxyFactory.create(mathSvcOptions);
    //   // },
    //   // inject: [ConfigService],
    // },
  ],
})
export class AppModule {}
