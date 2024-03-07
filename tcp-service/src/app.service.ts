import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly books: { id: string; title: string }[] = [];

  getBook(id: string) {
    return this.books.find((book) => book.id === id) ?? 'No book found';
  }

  listBooks() {
    return this.books;
  }

  addBook(book: { id?: string; title: string }) {
    const newBook = { ...book, id: book.id || Date.now().toString() };
    this.books.push(newBook);
  }

  async removeBook(id: string) {
    const index = this.books.findIndex((book) => book.id === id);
    if (index >= 0) {
      this.books.splice(index, 1);
    }
  }
}
