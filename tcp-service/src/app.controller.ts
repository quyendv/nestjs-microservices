import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_book' })
  getBook(@Payload() data: { id: string } /* pass dto */) {
    Logger.debug(data, 'Received get_book pattern');
    return this.appService.getBook(data.id);
  }

  @EventPattern({ cmd: 'create_book' })
  createBook(data: { id?: string; title: string }) {
    Logger.debug(data, 'Received create_book pattern');
    this.appService.addBook(data);
  }

  @MessagePattern({ cmd: 'list_books' })
  listBooks() {
    Logger.debug('List book', 'Received list_books pattern');
    return this.appService.listBooks();
  }

  @EventPattern({ cmd: 'remove_book' })
  removeBook(@Payload() data: { id: string }) {
    Logger.debug(data, 'Received remove_book pattern');
    return this.appService.removeBook(data.id);
  }
}
