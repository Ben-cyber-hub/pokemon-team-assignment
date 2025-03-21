import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonListParams } from '../types/pokemon.types';

const CACHE_DURATION = 30 * 60 * 1000;
const TOTAL_POKEMON = 1126;
const TOTAL_PAGES = 57; // With 20 per page
const cache = new Map<string, { data: any; timestamp: number }>();

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

/**
 * Fetches a paginated list of Pokemon
 * Handles offset=0 case specially to avoid API errors
 */
export const getPokemonList = async ({
  page = 1,
  limit = 20
}: PokemonListParams = {}): Promise<PokemonListResponse> => {
  const offset = (page - 1) * limit;
  const cacheKey = `pokemon-list-${offset}-${limit}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = offset === 0 
      ? `/pokemon/?limit=${limit}`
      : `/pokemon/?limit=${limit}&offset=${offset}`;

    const response = await api.get<PokemonListResponse>(url);

    const data = {
      ...response.data,
      page,
      totalPages: Math.ceil(response.data.count / limit)
    };

    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error('Failed to fetch Pokemon list:', error);
    // Return fallback data instead of throwing
    return {
      count: TOTAL_POKEMON,
      next: page < TOTAL_PAGES ? `offset=${offset + limit}` : null,
      previous: page > 1 ? `offset=${offset - limit}` : null,
      results: Array(limit).fill({ name: 'error', url: '' }),
      page,
      totalPages: TOTAL_PAGES
    };
  }
};

/**
 * Fetches detailed Pokemon data by name
 * Returns null for failed requests to allow graceful degradation
 */
export const getPokemonByName = async (name: string): Promise<Pokemon | null> => {
  if (name === 'error') return null;
  
  const cacheKey = `pokemon-${name.toLowerCase()}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await api.get<Pokemon>(`/pokemon/${name.toLowerCase()}`);
    
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Pokemon ${name}:`, error);
    return null;
  }
};

export const getPokemonsByType = async (type: string): Promise<Pokemon[]> => {
  const cacheKey = `pokemon-type-${type}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await api.get<{ pokemon: { pokemon: Pokemon }[] }>(`/type/${type}`);
    const pokemonList = response.data.pokemon.map(p => p.pokemon);
    
    cache.set(cacheKey, {
      data: pokemonList,
      timestamp: Date.now()
    });

    return pokemonList;
  } catch (error) {
    console.error(`Failed to fetch Pokemon of type ${type}:`, error);
    throw error;
  }
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const cacheKey = `pokemon-${id}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await api.get<Pokemon>(`/pokemon/${id}`);
    
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Pokemon with ID ${id}:`, error);
    throw new Error(`Pokemon with ID ${id} not found`);
  }
};