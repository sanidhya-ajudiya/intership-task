import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-3 animate-pulse">
      <div className="w-full aspect-square bg-gray-800/80 rounded-xl"></div>
      <div className="h-4 bg-gray-800/80 rounded w-3/4"></div>
      <div className="h-3 bg-gray-800/60 rounded w-full"></div>
      <div className="h-3 bg-gray-800/60 rounded w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-800/80 rounded w-1/3"></div>
        <div className="h-8 bg-gray-800/80 rounded-xl w-24"></div>
      </div>
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-3">
      <div className="h-4 bg-gray-800/80 rounded w-1/2"></div>
      <div className="h-8 bg-gray-800/80 rounded w-3/4"></div>
      <div className="h-3 bg-gray-800/60 rounded w-1/3"></div>
    </div>
  );
};

export default ProductCardSkeleton;
