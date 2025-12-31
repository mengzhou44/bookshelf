interface HeaderProps {
  onAddBook: () => void;
}

export default function Header({ onAddBook }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">📚 Bookshelf</h1>
          <button
            onClick={onAddBook}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Book
          </button>
        </div>
      </div>
    </header>
  );
}

