import axios, { AxiosError } from 'axios';
import { Pokemon, PokemonListResponse, Generation } from '../types/pokemon.types';

// Define the structure for generation ranges (e.g., Gen 1: Pokemon 1-151)
interface GenerationRange {
  start: number;
  end: number;
}

// Cache configuration for API responses
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000, // 10 second timeout
});

// Global error handler for API requests
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error('API Error:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    throw error;
  }
);

// Define Pokemon ranges for each generation
const GENERATION_RANGES: Record<Generation, GenerationRange> = {
    'gen1': { start: 1, end: 151 },    // Red, Blue, Yellow
    'gen2': { start: 152, end: 251 },  // Gold, Silver, Crystal
    'gen3': { start: 252, end: 386 },  // Ruby, Sapphire, Emerald
    'gen4': { start: 387, end: 493 },  // Diamond, Pearl, Platinum
    'gen5': { start: 494, end: 649 },  // Black, White
    'gen6': { start: 650, end: 721 },  // X, Y
    'gen7': { start: 722, end: 809 },  // Sun, Moon
    'gen8': { start: 810, end: 898 },  // Sword, Shield
    'gen9': { start: 899, end: 1025 }, // Scarlet, Violet
  };

/**
 * Generic cache wrapper for API calls
 * Implements a stale-while-revalidate caching strategy
 * Returns cached data if available and not expired
 * Falls back to stale cache data if API call fails
 */
const cachedApiCall = async <T>(
  key: string,
  apiFn: () => Promise<T>
): Promise<T> => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  try {
    const data = await apiFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (cached) {
      console.warn(`Using stale cache for ${key} due to API error`);
      return cached.data as T;
    }
    throw error;
  }
};

// Parameters for paginated Pokemon list requests
interface PokemonListParams {
  page?: number;
  limit?: number;
  generation?: Generation;
}

/**
 * Fetches a paginated list of Pokemon within a specific generation
 * Handles pagination and generation boundaries
 */
export const getPokemonList = async ({
  page = 1,
  limit = 24,
  generation = 'gen1'
}: PokemonListParams = {}): Promise<PokemonListResponse> => {
  // Calculate correct offset based on generation and page
  const { start, end } = GENERATION_RANGES[generation];
  const genOffset = start - 1;
  const pageOffset = (page - 1) * limit;
  const totalOffset = genOffset + pageOffset;
  
  // Ensure we don't exceed generation boundaries
  const adjustedLimit = Math.min(limit, end - (genOffset + pageOffset) + 1);

  return cachedApiCall(
    `pokemonList-${generation}-${page}-${limit}`,
    async () => {
      const response = await api.get(`/pokemon?offset=${totalOffset}&limit=${adjustedLimit}`);
      return response.data;
    }
  );
};

/**
 * Fetches detailed Pokemon information by name
 * Uses cache to prevent redundant API calls
 */
export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  return cachedApiCall(
    `pokemon-${name}`,
    async () => {
      const response = await api.get(`/pokemon/${name.toLowerCase()}`);
      return response.data;
    }
  );
};

/**
 * Fetches detailed Pokemon information by ID
 * Uses cache to prevent redundant API calls
 */
export const getPokemonById = async (id: number): Promise<Pokemon> => {
  return cachedApiCall(
    `pokemon-${id}`,
    async () => {
      const response = await api.get(`/pokemon/${id}`);
      return response.data;
    }
  );
};

/**
 * Fetches all Pokemon of a specific type
 * Returns simplified Pokemon objects for the type
 */
export const getPokemonsByType = async (type: string): Promise<Pokemon[]> => {
  return cachedApiCall(
    `pokemon-type-${type}`,
    async () => {
      const response = await api.get(`/type/${type}`);
      return response.data.pokemon.map((p: { pokemon: Pokemon }) => p.pokemon);
    }
  );
};

/**
 * Search function that attempts to find Pokemon by:
 * 1. Exact ID match
 * 2. Name contains search term
 * 3. Type matches search term
 * Returns an array of matching Pokemon
 */
export const searchPokemon = async (searchTerm: string): Promise<Pokemon[]> => {
  if (!searchTerm) return [];
  
  try {
    // First, try to find Pokemon by ID
    const pokemonId = parseInt(searchTerm);
    if (!isNaN(pokemonId)) {
      const pokemon = await getPokemonById(pokemonId);
      return [pokemon];
    }

    // If not an ID, search by name
    const searchTermLower = searchTerm.toLowerCase();
    
    // Get all Pokemon for name search
    const { results } = await getPokemonList({ 
      page: 1, 
      limit: 1025 // Get all Pokemon in one request
    });
    
    // Filter Pokemon whose names contain the search term
    const matchingResults = results.filter(pokemon => 
      pokemon.name.includes(searchTermLower)
    );

    if (matchingResults.length > 0) {
      // Get full details for matching Pokemon
      const detailedPokemon = await Promise.all(
        matchingResults.map(pokemon => getPokemonByName(pokemon.name))
      );
      return detailedPokemon;
    }

    // If no name matches, try searching by type
    const byType = await getPokemonsByType(searchTermLower);
    return byType.slice(0, 24); // Limit type results to prevent overwhelming the UI

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};