import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`p-2 rounded-xl border border-gray-800 flex items-center gap-1 text-xs font-semibold ${
          page === 1
            ? 'text-gray-600 border-gray-900 cursor-not-allowed'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
            num === page
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800/80'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`p-2 rounded-xl border border-gray-800 flex items-center gap-1 text-xs font-semibold ${
          page === pages
            ? 'text-gray-600 border-gray-900 cursor-not-allowed'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
