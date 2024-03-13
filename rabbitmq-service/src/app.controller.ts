import { Body, Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

interface Cat {
  id: number;
  name: string;
  age: number;
}

@Controller()
export class AppController {
  private cats: Cat[] = [
    { id: 1, name: 'Whiskers', age: 3 },
    { id: 2, name: 'Fluffy', age: 5 },
    { id: 3, name: 'Mittens', age: 2 },
    { id: 4, name: 'Oreo', age: 4 },
    { id: 5, name: 'Simba', age: 1 },
    { id: 6, name: 'Luna', age: 3 },
    { id: 7, name: 'Max', age: 2 },
    { id: 8, name: 'Bella', age: 5 },
    { id: 9, name: 'Charlie', age: 4 },
    { id: 10, name: 'Lucy', age: 2 },
    { id: 11, name: 'Oliver', age: 3 },
    { id: 12, name: 'Lily', age: 1 },
  ];

  @MessagePattern('list_cats')
  getAllCats(@Payload() data: any, @Ctx() context: RmqContext): Cat[] {
    Logger.debug('Received list_cats pattern');
    console.log({
      data,
      message: context.getMessage(),
      pattern: context.getPattern(),
      channel: context.getChannelRef(),
    });
    return this.cats;
  }

  @MessagePattern('get_cat')
  getCatById(@Payload() id: number): Cat {
    Logger.debug('Received get_cat pattern');
    return this.cats.find((cat) => cat.id === id) ?? null;
  }

  @EventPattern('create_cat')
  createCat(@Body() cat: Cat): Cat {
    Logger.debug('Received create_cat pattern');
    const newCat = { id: this.cats.length + 1, ...cat };
    this.cats.push(newCat);
    return newCat;
  }

  @EventPattern('update_cat')
  updateCat(@Payload() cat: Cat): Cat {
    Logger.debug('Received update_cat pattern');
    const catIndex = this.cats.findIndex((c) => c.id === cat.id);
    if (catIndex !== -1) {
      this.cats[catIndex] = { id: cat.id, ...cat };
      return this.cats[catIndex];
    }
    return null;
  }

  @EventPattern('delete_cat')
  deleteCat(@Payload() id: number): Cat {
    Logger.debug('Received delete_cat pattern');
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex !== -1) {
      const deletedCat = this.cats[catIndex];
      this.cats.splice(catIndex, 1);
      return deletedCat;
    }
    return null;
  }
}
