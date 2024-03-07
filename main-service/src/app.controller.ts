import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TCP_BOOKS_SERVICE') private readonly tcpClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tcp/:id')
  getTcpBookById(@Param('id') id: string) {
    // console.log(this.tcpClient); // before sending first pattern, isConnected = false
    return this.tcpClient.send(
      { cmd: 'get_book' },
      { id /* source: 'Main Service' */ },
    );
  }

  @Post('tcp')
  createTcpBook(@Body() book: { title: string }) {
    return this.tcpClient.emit({ cmd: 'create_book' }, book);
  }

  @Get('tcp')
  listTcpBooks() {
    return this.tcpClient.send({ cmd: 'list_books' }, {});
  }

  @Delete('tcp/:id')
  removeTcpBook(@Param('id') id: string) {
    return this.tcpClient.emit({ cmd: 'remove_book' }, { id });
  }
}
