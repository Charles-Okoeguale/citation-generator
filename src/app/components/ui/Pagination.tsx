import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFirstPage,
  isLastPage,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  showItemsPerPage = false
}: PaginationProps) {
  // Generate limited page numbers to avoid too many buttons
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if we have fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      // Calculate the range around current page
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed on the left
      if (leftBound > 2) {
        pageNumbers.push('...');
      }
      
      // Add pages around current page
      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed on the right
      if (rightBound < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Add last page if not already added
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{Math.min(totalItems, 1 + (currentPage - 1) * itemsPerPage)}</span> to{' '}
        <span className="font-medium">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      
      <div className="flex items-center space-x-2">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="block w-20 py-1 px-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:border-[rgb(200,75,110)] focus:ring-[rgb(200,75,110)] dark:focus:ring-[rgb(220,120,150)]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? 'z-10 bg-[rgb(200,75,110)] dark:bg-[rgb(200,75,110)] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(200,75,110)] dark:focus-visible:outline-[rgb(220,120,150)]'
                    : 'text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600"
              >
                ...
              </span>
            )
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
} 