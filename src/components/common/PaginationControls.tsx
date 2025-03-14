import { useState, FormEvent } from 'react';

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ 
  page, 
  setPage, 
  totalPages 
}) => {
  const [inputPage, setInputPage] = useState(page.toString());

  const handleGoToPage = (e: FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(inputPage);
    if (!isNaN(newPage) && newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
    setInputPage(page.toString());
  };

  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
      >
        Previous
      </button>

      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <label className="text-sm">
          Page
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            className="w-16 px-2 py-1 ml-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          of {totalPages}
        </label>
        <button
          type="submit"
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go
        </button>
      </form>

      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};