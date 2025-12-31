import { Book, CreateBookRequest, UpdateBookRequest } from '../types.js';
import * as bookRepository from './book.repository.js';

// Business logic layer - handles validation and business rules
export const getAllBooks = async (): Promise<Book[]> => {
  return await bookRepository.getAllBooks();
};

export const getBookById = async (id: string): Promise<Book | null> => {
  return await bookRepository.getBookById(id);
};

export const createBook = async (bookData: CreateBookRequest): Promise<Book> => {
  // Business logic: validate required fields
  if (!bookData.title || !bookData.author || !bookData.status) {
    throw new Error('Title, author, and status are required');
  }

  // Business logic: create book entity
  const newBook: Book = {
    id: Date.now().toString(),
    title: bookData.title,
    author: bookData.author,
    status: bookData.status,
    notes: bookData.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return await bookRepository.createBook(newBook);
};

export const updateBook = async (id: string, updates: UpdateBookRequest): Promise<Book | null> => {
  // Business logic: check if book exists
  const existingBook = await bookRepository.getBookById(id);
  if (!existingBook) {
    return null;
  }

  // Business logic: update book
  return await bookRepository.updateBook(id, updates);
};

export const deleteBook = async (id: string): Promise<boolean> => {
  // Business logic: check if book exists before deletion
  const existingBook = await bookRepository.getBookById(id);
  if (!existingBook) {
    return false;
  }

  return await bookRepository.deleteBook(id);
};

