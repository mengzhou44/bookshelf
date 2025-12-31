import { Book, BookStatus } from '../types';
import BookCard from './book-card';

interface BookListProps {
  books: Book[];
  onUpdateStatus: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
  onViewNotes: (book: Book) => void;
}

export default function BookList({ books, onUpdateStatus, onDelete, onViewNotes }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No books found. Add your first book to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onViewNotes={onViewNotes}
        />
      ))}
    </div>
  );
}

