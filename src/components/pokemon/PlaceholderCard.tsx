import { ReactElement } from 'react';

/**
 * PlaceholderCard Component
 * 
 * Displays a loading skeleton animation for Pokemon cards.
 * Maintains the same dimensions and layout as the actual PokemonCard
 * to prevent layout shifts during loading.
 */
export const PlaceholderCard = (): ReactElement => {
  return (
    <div 
      className="bg-gray-100 rounded-lg shadow-md p-2 animate-pulse"
      role="status"
      aria-label="Loading Pokemon data"
    >
      {/* Image placeholder */}
      <div 
        className="w-full aspect-square bg-gray-200 rounded"
        aria-hidden="true"
      />
      
      {/* Content placeholders */}
      <div className="mt-1 text-center space-y-2">
        {/* Name placeholder */}
        <div 
          className="h-4 bg-gray-200 rounded w-20 mx-auto"
          aria-hidden="true"
        />
        
        {/* ID placeholder */}
        <div 
          className="h-3 bg-gray-200 rounded w-12 mx-auto"
          aria-hidden="true"
        />

        {/* Types placeholder */}
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          <div 
            className="h-3 bg-gray-200 rounded w-12"
            aria-hidden="true"
          />
          <div 
            className="h-3 bg-gray-200 rounded w-12"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading Pokemon information...</span>
    </div>
  );
};