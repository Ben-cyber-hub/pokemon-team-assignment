import { useState, FormEvent, ChangeEvent } from 'react';

interface PaginationControlsProps {
  /** Current page number */
  page: number;
  /** Function to update the current page */
  setPage: (page: number) => void;
  /** Total number of available pages */
  totalPages: number;
  /** Optional page size for aria label */
  pageSize?: number;
}

/**
 * PaginationControls Component
 * 
 * Provides navigation controls for paginated content with direct page input.
 * Includes Previous/Next buttons and a form to jump to specific pages.
 */
export const PaginationControls = ({ 
  page, 
  setPage, 
  totalPages,
  pageSize = 10
}: PaginationControlsProps) => {
  const [inputPage, setInputPage] = useState(page.toString());
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setInputPage(e.target.value);
  };

  const handleGoToPage = (e: FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(inputPage);

    if (isNaN(newPage)) {
      setError('Please enter a valid number');
      return;
    }

    if (newPage < 1 || newPage > totalPages) {
      setError(`Please enter a number between 1 and ${totalPages}`);
      return;
    }

    setPage(newPage);
    setError(null);
  };

  return (
    <nav 
      role="navigation" 
      aria-label="Pagination navigation"
      className="flex flex-col items-center gap-2 py-4"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 
                     hover:bg-orange-600 transition-colors"
          aria-label="Go to previous page"
        >
          Previous
        </button>

        <form 
          onSubmit={handleGoToPage} 
          className="flex items-center gap-2"
          aria-label="Go to page form"
        >
          <label className="text-sm flex items-center">
            <span className="mr-2">Page</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={handleInputChange}
              className="w-16 px-2 py-1 border rounded focus:outline-none focus:ring-2 
                       focus:ring-orange-500 text-center"
              aria-label={`Go to page (1-${totalPages})`}
            />
            <span className="ml-2">of {totalPages}</span>
          </label>
          <button
            type="submit"
            className="px-2 py-1 text-sm bg-orange-500 text-white rounded 
                     hover:bg-orange-600 transition-colors"
          >
            Go
          </button>
        </form>

        <button 
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 
                   hover:bg-orange-600 transition-colors"
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-1" role="alert">
          {error}
        </p>
      )}

      <div className="text-sm text-gray-600">
        Showing items {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalPages * pageSize)}
      </div>
    </nav>
  );
};