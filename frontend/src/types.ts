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

