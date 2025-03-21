// Definition of the types used in the Pokemon API service
// This file will be used to define the types of the data that we will be using in the Pokemon API service.
import { GENERATION_RANGES } from '../constants/pokemon';
export { GENERATION_RANGES };

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

// Simplified types
export interface Pokemon {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }>;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
      name: string;
      url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
  page?: number;
  totalPages?: number;
}

export type Generation = 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'gen5' | 'gen6' | 'gen7' | 'gen8' | 'gen9';

export interface PokemonListParams {
  page?: number;
  limit?: number;
  generation?: Generation;
}

export interface UsePokemonDataProps {
  generation: Generation;
  selectedType: PokemonType | '';
  searchTerm: string;
  page: number;
  pageSize: number;
}
