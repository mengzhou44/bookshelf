import { BookStatus } from '../types';

interface FilterBarProps {
  filter: BookStatus | 'All';
  onFilterChange: (filter: BookStatus | 'All') => void;
}

export default function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const filters: (BookStatus | 'All')[] = ['All', 'Read', 'Reading', 'Not Read'];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === f
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

