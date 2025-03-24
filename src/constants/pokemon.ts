import { Generation } from '../types/pokemon.types';

/**
 * All available Pokemon types in the game
 * Used for type analysis and UI display
 */
export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

/**
 * Pagination and grid layout constants
 * Used for consistent Pokemon display across components
 */
export const POKEMON_PER_ROW = 5;
export const ROWS_PER_PAGE = 4;
export const PAGE_SIZE = POKEMON_PER_ROW * ROWS_PER_PAGE; 

/**
 * Generation labels for UI display
 */
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

/**
 * Pokemon ID ranges for each generation
 * Used for filtering and navigation
 */
export const GENERATION_RANGES: Record<Generation, { start: number; end: number }> = {
  gen1: { start: 1, end: 151 },
  gen2: { start: 152, end: 251 },
  gen3: { start: 252, end: 386 },
  gen4: { start: 387, end: 493 },
  gen5: { start: 494, end: 649 },
  gen6: { start: 650, end: 721 },
  gen7: { start: 722, end: 809 },
  gen8: { start: 810, end: 905 },
  gen9: { start: 906, end: 1025 }
};