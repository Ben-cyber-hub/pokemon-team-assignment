import { useState, useEffect } from 'react';
import { usePokemonData } from '../hooks/usePokemonData';
import { Pokemon, Generation, PokemonType } from '../types/pokemon.types';
import { useDebounce } from '../hooks/useDebounce';
import { PokemonCard } from '../components/pokemon/pokemonCard';

// Move constants to a separate file
import { POKEMON_TYPES, GENERATION_LABELS, PAGE_SIZE } from '../constants/pokemon';

// TODO: Import these when implementing team building
// import { useTeam } from '../hooks/useTeam';
// import { useAuth } from '../hooks/useAuth';

// Separate PaginationControls into its own component file
import { PaginationControls } from '../components/common/PaginationControls';

export const Pokedex = () => {
  // Basic state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [generation, setGeneration] = useState<Generation>('gen1');
  const [selectedType, setSelectedType] = useState<PokemonType | ''>('');
  
  // TODO: Add these when implementing team building
  // const { user } = useAuth();
  // const { addPokemonToTeam, isTeamBuilding } = useTeam();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { 
    pokemon: displayedPokemon, 
    isLoading, 
    totalPages,
    totalPokemon 
  } = usePokemonData({
    generation,
    selectedType,
    searchTerm: debouncedSearch,
    page,
    pageSize: PAGE_SIZE
  });

  const handlePokemonClick = (pokemon: Pokemon) => {
    // TODO: Implement Pokemon selection for team building
    console.log('Selected Pokemon:', pokemon);
    /* 
    Future implementation:
    if (!user) {
      navigate('/login');
      return;
    }

    if (isTeamBuilding) {
      addPokemonToTeam(pokemon);
    } else {
      showPokemonDetails(pokemon);
    }
    */
  };

  useEffect(() => {
    setPage(1);
  }, [generation, selectedType, debouncedSearch]);

  if (isLoading) {
    return <div className="text-center">Loading Pokémon...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
      
      {/* Filters section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          aria-label="generation"
          value={generation}
          onChange={(e) => setGeneration(e.target.value as Generation)}
          className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(GENERATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          aria-label="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as PokemonType | '')}
          className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {POKEMON_TYPES.map(type => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all Pokémon..."
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

      {/* Show pagination only when not searching */}
      {!debouncedSearch && totalPages > 0 && (
        <PaginationControls 
          page={page} 
          setPage={setPage} 
          totalPages={totalPages} 
        />
      )}

      {/* Pokemon grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {(displayedPokemon ?? []).length > 0 ? (
        displayedPokemon.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon}
            onClick={handlePokemonClick}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          {debouncedSearch 
            ? `No Pokémon found matching "${searchTerm}"`
            : 'No Pokémon found for selected filters'
          }
        </div>
      )}
    </div>

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