import { Generation } from '../types/pokemon.types';

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export const POKEMON_PER_ROW = 6;
export const ROWS_PER_PAGE = 4;
export const PAGE_SIZE = POKEMON_PER_ROW * ROWS_PER_PAGE;

export const GENERATION_LABELS: Record<Generation, string> = {
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