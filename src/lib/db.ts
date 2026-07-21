import fs from 'fs';
import path from 'path';
import { Book } from '../app/types';
import { BOOKS as initialBooks } from '../app/data';

const dbPath = path.join(process.cwd(), 'src/app/data.json');

// Ensure db file exists, otherwise seed it
const initDb = (): Book[] => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Create folder if it doesn't exist
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Seed with initial books
      fs.writeFileSync(dbPath, JSON.stringify(initialBooks, null, 2), 'utf-8');
      return initialBooks;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return initialBooks;
  }
};

export const getBooks = (): Book[] => {
  return initDb();
};

export const saveBooks = (books: Book[]): void => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(books, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database:', error);
    throw new Error('Failed to save data');
  }
};

export const getBookById = (id: string): Book | undefined => {
  const books = getBooks();
  return books.find(b => b.id === id);
};

export const addBook = (book: Book): Book => {
  const books = getBooks();
  // Generate random id if not present
  const newBook = {
    ...book,
    id: book.id || 'b_' + Math.random().toString(36).substr(2, 9),
    status: 'بەردەستە لە ئەرشیف' // Force showcase status
  };
  books.push(newBook);
  saveBooks(books);
  return newBook;
};

export const updateBook = (id: string, updatedBook: Book): Book => {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Book not found');
  }
  
  const finalBook = { ...updatedBook, id };
  books[index] = finalBook;
  saveBooks(books);
  return finalBook;
};

export const deleteBook = (id: string): void => {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== id);
  saveBooks(filtered);
};
