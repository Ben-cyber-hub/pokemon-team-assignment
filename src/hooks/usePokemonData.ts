import { useMemo } from 'react'; // Removed useEffect as no longer needed
import { useQuery } from '@tanstack/react-query';
import { getPokemonList, getPokemonByName } from '../services/pokemonAPI';
import { Pokemon } from '../types/pokemon.types';
import { PAGE_SIZE } from '../constants/pokemon';

// Props for the hook
interface UsePokemonDataProps {
  searchTerm: string;
  page: number;
  pageSize?: number;
}

// Return type for better type safety and documentation
interface PokemonDataResult {
  pokemon: (Pokemon | null)[]; // Can be null if Pokemon fetch fails
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  totalPokemon: number;
  currentPage: number;
}

/**
 * Hook to fetch and manage Pokemon data with pagination and search
 * Handles failed Pokemon fetches gracefully by returning null entries
 */
export function usePokemonData({
  searchTerm,
  page,
  pageSize = PAGE_SIZE
}: UsePokemonDataProps): PokemonDataResult {
  // Fetch basic Pokemon list with pagination
  const { data: pokemonList, isLoading: isLoadingList, error: listError } = useQuery(
    ['pokemonList', page, pageSize],
    () => getPokemonList({ page, limit: pageSize }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
      useErrorBoundary: false
    }
  );

  // Fetch detailed Pokemon data for the current page
  const { data: pokemonDetails, isLoading: isLoadingDetails } = useQuery(
    ['pokemonDetails', pokemonList?.results],
    async () => {
      if (!pokemonList?.results) return [];
      
      const details = await Promise.allSettled(
        pokemonList.results.map(p => getPokemonByName(p.name))
      );

      return details.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );
    },
    {
      enabled: !!pokemonList?.results,
      staleTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
      useErrorBoundary: false
    }
  );

  // Filter Pokemon based on search term
  const filteredPokemon = useMemo(() => {
    if (!pokemonDetails) return [];
    if (!searchTerm) return pokemonDetails;

    const searchLower = searchTerm.toLowerCase();
    return pokemonDetails.filter(p => 
      p?.name?.toLowerCase().includes(searchLower)
    );
  }, [pokemonDetails, searchTerm]);

  return {
    pokemon: filteredPokemon || [],
    isLoading: isLoadingList || isLoadingDetails,
    error: listError instanceof Error ? listError : null,
    totalPages: pokemonList?.totalPages || 57,
    totalPokemon: pokemonList?.count || 1126,
    currentPage: page
  };
}