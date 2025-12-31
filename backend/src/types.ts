export type BookStatus = 'Read' | 'Reading' | 'Not Read';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  status: BookStatus;
  notes?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  status?: BookStatus;
  notes?: string;
}

