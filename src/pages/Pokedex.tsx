import { useState, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getPokemonByName, searchPokemon, getPokemonList } from '../services/pokemonAPI';
import { Pokemon, Generation } from '../types/pokemon.types';
import { useDebounce } from '../hooks/useDebounce';
import { PokemonCard } from '../components/pokemon/pokemonCard';

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

type PokemonType = typeof POKEMON_TYPES[number];

const POKEMON_PER_ROW = 6;
const ROWS_PER_PAGE = 4;
const PAGE_SIZE = POKEMON_PER_ROW * ROWS_PER_PAGE;

const GENERATION_LABELS: Record<Generation, string> = {
  gen1: 'Generation I',
  gen2: 'Generation II',
  gen3: 'Generation III',
  gen4: 'Generation IV',
  gen5: 'Generation V',
  gen6: 'Generation VI',
  gen7: 'Generation VII',
  gen8: 'Generation VIII',
  gen9: 'Generation IX',
};

// Reusable pagination component
const PaginationControls = ({ page, setPage }: { page: number; setPage: (page: number) => void }) => {
  const [inputPage, setInputPage] = useState(page.toString());

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(inputPage);
    if (!isNaN(newPage) && newPage > 0) {
      setPage(newPage);
    }
    // Reset input to current page if invalid
    setInputPage(page.toString());
  };

  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      
      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <label className="text-sm">
          Page
          <input
            type="number"
            min="1"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            className="w-16 px-2 py-1 ml-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          type="submit"
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go
        </button>
      </form>

      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export const Pokedex = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [generation, setGeneration] = useState<Generation>('gen1');
  const [selectedType, setSelectedType] = useState<PokemonType | ''>('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch paginated list when not searching
  const { 
    data: pokemonList, 
    isLoading: isLoadingList, 
    error: listError 
  } = useQuery(
    ['pokemonList', page, generation],
    () => getPokemonList({ page, limit: PAGE_SIZE, generation }),
    {
      enabled: !debouncedSearch,
      keepPreviousData: true,
    }
  );
  // Fetch search results when searching
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: searchError
  } = useQuery(
    ['pokemon', 'search', debouncedSearch],
    () => searchPokemon(debouncedSearch),
    {
      enabled: !!debouncedSearch,
      keepPreviousData: true,
    }
  );

  // Fetch details for paginated Pokemon
  const pokemonQueries = useQueries({
    queries: (!debouncedSearch && pokemonList?.results ? pokemonList.results : []).map(pokemon => ({
      queryKey: ['pokemon', pokemon.name],
      queryFn: () => getPokemonByName(pokemon.name),
      staleTime: 5 * 60 * 1000,
    }))
  });

  const isLoadingDetails = pokemonQueries.some(query => query.isLoading);
  const detailsError = pokemonQueries.find(query => query.error);

  // Get Pokemon to display based on search or pagination
  const displayedPokemon = useMemo(() => {
    const pokemon = debouncedSearch ? (searchResults || []) : 
      pokemonQueries
        .map(query => query.data)
        .filter((pokemon): pokemon is Pokemon => pokemon !== undefined);
  
    // Apply type filter if selected
    if (selectedType && !debouncedSearch) {
      return (pokemon as Pokemon[]).filter(p => 
        p.types.some(t => t.type.name === selectedType)
      );
    }

    return pokemon || [];
  }, [debouncedSearch, searchResults, pokemonQueries, selectedType]);

  // Handle Pokemon selection
  const handlePokemonClick = (pokemon: Pokemon) => {
    console.log('Selected:', pokemon.name);
    // TODO: Implement Pokemon selection logic
  };

  // Show loading states
  if ((debouncedSearch && isLoadingSearch) || (!debouncedSearch && (isLoadingList || isLoadingDetails))) {
    return <div className="text-center">Loading Pokémon...</div>;
  }

  // Show error states
  if ((debouncedSearch && searchError) || (!debouncedSearch && (listError || detailsError))) {
    return <div className="text-center text-red-500">Error loading Pokémon</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Pokédex</h1>
      
      {/* Filters section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Generation selector */}
        <select
          value={generation}
          onChange={(e) => setGeneration(e.target.value as Generation)}
          className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!debouncedSearch}
        >
          {Object.entries(GENERATION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as PokemonType | '')}
          className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!debouncedSearch}
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

      {/* Show pagination only when not searching */}
      {!debouncedSearch && <PaginationControls page={page} setPage={setPage} />}

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

      {!debouncedSearch && <PaginationControls page={page} setPage={setPage} />}
    </div>
  );
};