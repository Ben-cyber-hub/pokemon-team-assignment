import { useState, useEffect } from 'react';
import { usePokemonData } from '../hooks/usePokemonData';
import { Pokemon } from '../types/pokemon.types';
import { useDebounce } from '../hooks/useDebounce';
import { PokemonCard } from '../components/pokemon/pokemonCard';
import { PaginationControls } from '../components/common/PaginationControls';
import { PAGE_SIZE } from '../constants/pokemon';

export const Pokedex = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { 
    pokemon: displayedPokemon, 
    isLoading, 
    error,
    totalPages,
    totalPokemon 
  } = usePokemonData({
    searchTerm: debouncedSearch,
    page,
    pageSize: PAGE_SIZE
  });

  const handlePokemonClick = (pokemon: Pokemon) => {
    if (!pokemon) return;
    console.log('Selected Pokemon:', pokemon);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (isLoading) {
    return <div className="text-center">Loading Pokémon...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-600 font-semibold mb-2">
          Unable to load Pokémon data
        </div>
        <div className="text-gray-600 text-sm">
          Please try again later or check your internet connection.
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Pokémon name..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Results summary */}
      <div className="text-center mb-4 text-gray-600">
        Showing {displayedPokemon.length} of {totalPokemon} Pokémon
      </div>

      {/* Pagination */}
      {!debouncedSearch && totalPages > 0 && (
        <PaginationControls 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
        />
      )}

      {/* Pokemon grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayedPokemon.length > 0 ? (
          displayedPokemon.map((pokemon, index) => (
            <PokemonCard 
              key={pokemon?.id || `pokemon-${index}`}
              pokemon={pokemon}
              onClick={pokemon ? handlePokemonClick : undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {debouncedSearch 
              ? `No Pokémon found matching "${searchTerm}"`
              : 'No Pokémon available'
            }
          </div>
        )}
      </div>

      {/* Bottom pagination */}
      {!debouncedSearch && totalPages > 0 && (
        <PaginationControls 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
        />
      )}
    </div>
  );
};