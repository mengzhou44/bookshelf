import { Book } from './types';

// Remove trailing slash if present to avoid double slashes
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Retry function for handling Render free tier spin-up delays
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3, delay = 2000): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      // If it's a 500 error and we have retries left, wait and retry
      if (response.status === 500 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error) {
      // If it's the last retry, throw the error
      if (i === retries - 1) throw error;
      // Otherwise wait and retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Failed after retries');
};

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const url = `${API_BASE_URL}/books`;
    console.log('Fetching books from:', url);
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    const response = await fetchWithRetry(url);
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to fetch books:', response.status, errorData);
      throw new Error(`Failed to fetch books: ${errorData.error || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in fetchBooks:', error);
    throw error;
  }
};

export const createBook = async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
  const response = await fetchWithRetry(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to create book');
  }
  return response.json();
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const response = await fetchWithRetry(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return response.json();
};

export const deleteBook = async (id: string): Promise<void> => {
  const response = await fetchWithRetry(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};

