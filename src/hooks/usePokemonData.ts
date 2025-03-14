import { useMemo, useEffect } from 'react';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPokemonList, getPokemonByName } from '../services/pokemonAPI';
import { Pokemon, Generation, PokemonType } from '../types/pokemon.types';

interface UsePokemonDataProps {
  generation: Generation;
  selectedType: PokemonType | '';
  searchTerm: string;
  page: number;
  pageSize: number;
}

export function usePokemonData({ 
  generation, 
  selectedType, 
  searchTerm, 
  page, 
  pageSize 
}: UsePokemonDataProps) {
  const queryClient = useQueryClient();

  // First, get the base Pokemon list for the generation
  const { data: pokemonList, isLoading: isLoadingList } = useQuery(
    ['pokemonList', generation],
    () => getPokemonList({ page: 1, limit: 1000, generation }),
    {
      staleTime: Infinity,
    }
  );

  // Filter and paginate the list before fetching details
  const filteredIndices = useMemo(() => {
    if (!pokemonList?.results) return [];
    
    let filtered = pokemonList.results;

    // Apply search filter if present
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.url.split('/').slice(-2, -1)[0].includes(searchLower)
      );
    }

    return filtered;
  }, [pokemonList, searchTerm]);

  // Fetch all Pokemon details for the filtered list
  const detailQueries = useQueries({
    queries: filteredIndices.map(pokemon => ({
      queryKey: ['pokemon', pokemon.name],
      queryFn: () => getPokemonByName(pokemon.name),
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }))
  });

  // Process results with type filtering and pagination
  const {
    displayedPokemon,
    totalPokemon,
    computedTotalPages
  } = useMemo(() => {
    // Get all successfully loaded Pokemon
    const loadedPokemon = detailQueries
      .map(query => query.data)
      .filter((pokemon): pokemon is Pokemon => !!pokemon);

    // Apply type filtering
    let typeFiltered = loadedPokemon;
    if (selectedType) {
      typeFiltered = loadedPokemon.filter(pokemon => 
        pokemon.types.some(t => t.type.name === selectedType)
      );
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPokemon = typeFiltered.slice(startIndex, endIndex);

    return {
      displayedPokemon: paginatedPokemon,
      totalPokemon: typeFiltered.length,
      computedTotalPages: Math.ceil(typeFiltered.length / pageSize)
    };
  }, [detailQueries, selectedType, page, pageSize]);

  // Prefetch next page
  useEffect(() => {
    if (page < computedTotalPages) {
      const nextPageStart = page * pageSize;
      const nextPageEnd = nextPageStart + pageSize;
      filteredIndices.slice(nextPageStart, nextPageEnd).forEach(pokemon => {
        queryClient.prefetchQuery(
          ['pokemon', pokemon.name],
          () => getPokemonByName(pokemon.name)
        );
      });
    }
  }, [page, pageSize, computedTotalPages, filteredIndices, queryClient]);

  return {
    pokemon: displayedPokemon,
    isLoading: isLoadingList || detailQueries.some(query => query.isLoading),
    totalPages: computedTotalPages,
    totalPokemon
  };
}