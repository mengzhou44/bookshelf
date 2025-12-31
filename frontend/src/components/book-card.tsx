import { Book, BookStatus } from '../types';

interface BookCardProps {
  book: Book;
  onUpdateStatus: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
  onViewNotes: (book: Book) => void;
}

const statusColors: Record<BookStatus, string> = {
  'Read': 'bg-green-100 text-green-800 border-green-300',
  'Reading': 'bg-blue-100 text-blue-800 border-blue-300',
  'Not Read': 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function BookCard({ book, onUpdateStatus, onDelete, onViewNotes }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm">by {book.author}</p>
        </div>
        <button
          onClick={() => onDelete(book.id)}
          className="text-red-500 hover:text-red-700 text-xl font-bold ml-2"
          title="Delete book"
        >
          ×
        </button>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[book.status]}`}>
          {book.status}
        </span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
        <select
          value={book.status}
          onChange={(e) => onUpdateStatus(book.id, e.target.value as BookStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Not Read">Not Read</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>

      <button
        onClick={() => onViewNotes(book)}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        {book.notes ? '📝 View/Edit Notes' : '📝 Add Notes'}
      </button>
    </div>
  );
}

