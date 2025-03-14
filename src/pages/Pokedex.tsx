import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getPokemonByName } from '../services/pokemonAPI';
import { usePokemonList } from '../hooks/usePokemon';
import { PokemonCard } from '../components/pokemon/pokemonCard';
import { Pokemon } from '../types/pokemon.types';

export const Pokedex = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  
  // Fetch paginated list of Pokemon
  const { 
    data: pokemonList, 
    isLoading: isLoadingList, 
    error: listError 
  } = usePokemonList(page);
  
  // Use useQueries to fetch details for all Pokemon in the current page
  const pokemonQueries = useQueries({
    queries: (pokemonList?.results ?? []).map((pokemon) => ({
      queryKey: ['pokemon', pokemon.name],
      queryFn: () => getPokemonByName(pokemon.name),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }))
  });

  // Derive loading and error states from all queries
  const isLoadingDetails = pokemonQueries.some(query => query.isLoading);
  const detailsError = pokemonQueries.find(query => query.error);

  // Filter out any undefined Pokemon and ensure type safety
  const pokemonDetails = pokemonQueries
    .map(query => query.data)
    .filter((pokemon): pokemon is Pokemon => pokemon !== undefined);

  // Handle Pokemon selection (to be implemented)
  const handlePokemonClick = (pokemon: Pokemon) => {
    console.log('Selected:', pokemon.name);
    // TODO: Implement Pokemon selection logic
  };

  // Show loading state while fetching list or details
  if (isLoadingList || isLoadingDetails) {
    return <div className="text-center">Loading Pokémon...</div>;
  }
  
  // Show error state if either list or detail fetching fails
  if (listError || detailsError) {
    return <div className="text-center text-red-500">Error loading Pokémon</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
      
      {/* Search bar for filtering Pokemon (to be implemented) */}
      <div className="mb-6">
        <input 
          type="text"
          placeholder="Search Pokémon..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Responsive Pokemon grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonDetails.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon}
            onClick={handlePokemonClick}
          />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex justify-center gap-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="py-2">Page {page}</span>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};