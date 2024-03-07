import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('TCP_BOOKS_SERVICE') private readonly tcpClient: ClientProxy,
    @Inject('GRPC_USERS_SERVICE') private readonly grpcClient: ClientGrpc,
  ) {}

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

  @Get('grpc')
  listGrpcUsers() {
    return this.grpcClient.getService<any>('UserService').getUsers({});
  }

  @Post('grpc')
  createGrpcUser(@Body() user: { name: string }) {
    return this.grpcClient.getService<any>('UserService').createUser(user);
  }

  @Delete('grpc/:id')
  removeGrpcUser(@Param('id') id: string) {
    return this.grpcClient
      .getService<any>('UserService')
      .deleteUser({ id: +id });
  }

  @Put('grpc/:id')
  updateGrpcUser(@Param('id') id: string, @Body() user: { name: string }) {
    return this.grpcClient
      .getService<any>('UserService')
      .updateUser({ id: +id, name: user.name });
  }
}
