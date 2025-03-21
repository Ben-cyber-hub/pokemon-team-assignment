import { useQuery } from '@tanstack/react-query';
import { getPokemonByName, getPokemonList, getPokemonById, getPokemonsByType } from '../services/pokemonAPI';
import { Pokemon, PokemonListResponse } from '../types/pokemon.types';

/**
 * Hook to fetch a paginated list of Pokemon
 * @param page - Current page number (starting from 1)
 * @param pageSize - Number of Pokemon per page
 * //@returns Query object containing the Pokemon list data, loading state, and error state
 */
export const usePokemonList = (page: number = 1, pageSize: number = 20) => {
    return useQuery<PokemonListResponse>(
      ['pokemonList', page], 
      () => getPokemonList({ 
        page, 
        limit: pageSize,
        generation: 'gen1' 
      }),
      {
        keepPreviousData: true, // Keeps old data while fetching new data
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes before refetching
      }
    );
  };
  

/**
 * Hook to fetch detailed Pokemon information by name or ID
 */
export const usePokemonDetails = (nameOrId: string | number) => {
  return useQuery<Pokemon | null, Error>(
    ['pokemon', nameOrId],
    async () => {
      try {
        const result = typeof nameOrId === 'string' 
          ? await getPokemonByName(nameOrId)
          : await getPokemonById(nameOrId);
        
        if (!result) {
          throw new Error(`Pokemon ${nameOrId} not found`);
        }
        
        return result;
      } catch (error) {
        throw error instanceof Error 
          ? error 
          : new Error('Failed to fetch Pokemon');
      }
    },
    {
      enabled: !!nameOrId,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error.message.includes('not found')) return false;
        return failureCount < 2;
      }
    }
  );
};

/**
 * Hook to fetch all Pokemon of a specific type
 * @param type - Pokemon type (e.g., 'fire', 'water')
 * @returns Query object containing the array of Pokemon of the specified type
 */
export const usePokemonsByType = (type: string) => {
  return useQuery<Pokemon[]>(['pokemonByType', type],
    () => getPokemonsByType(type),
    {
      enabled: !!type, // Only fetch when type is provided
      staleTime: 5 * 60 * 1000,
    }
  );
};

export { usePokemonData } from './usePokemonData';