import { ReactElement } from 'react';

export const PlaceholderCard = (): ReactElement => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-2 animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded"></div>
      <div className="mt-1 text-center">
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};