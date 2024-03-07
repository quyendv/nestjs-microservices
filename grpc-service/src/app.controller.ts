/* eslint-disable @typescript-eslint/no-unused-vars */

import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly users: { id: number; name: string }[] = [];

  constructor() {
    this.users.push({ id: 1, name: 'John' });
    this.users.push({ id: 2, name: 'Doe' });
    this.users.push({ id: 3, name: 'Smith' });
    this.users.push({ id: 4, name: 'Alex' });
    this.users.push({ id: 5, name: 'Jane' });
    this.users.push({ id: 6, name: 'Michael' });
    this.users.push({ id: 7, name: 'Emily' });
    this.users.push({ id: 8, name: 'Nat' });
  }

  @GrpcMethod('UserService', 'getUsers')
  getUsers(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    // console.log(data, metadata, call);
    Logger.debug('Get Users', 'AppController');
    return { users: this.users };
  }

  @GrpcMethod('UserService', 'createUser')
  createUser(data: { name: string }) {
    Logger.debug('Create User', 'AppController');
    const user = { ...data, id: Math.floor(Math.random() * 100) };
    this.users.push(user);
    return user;
  }

  @GrpcMethod('UserService', 'deleteUser')
  deleteUser(data: { id: number }) {
    Logger.debug('Delete User', 'AppController');
    this.users.splice(
      this.users.findIndex((user) => user.id === data.id),
      1,
    );
    return data;
  }

  @GrpcMethod('UserService', 'updateUser')
  updateUser(data: { id: number; name: string }) {
    Logger.debug('Update User', 'AppController');
    const id = this.users.findIndex((user) => user.id === data.id);
    if (id !== -1) {
      this.users[id].name = data.name;
      return { user: this.users[id] };
    } else {
      return {};
    }
  }
}
