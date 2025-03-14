import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../types/pokemon.types';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});

// This function will return a list of pokemons
export const getPokemonList = async (offset: number = 0, limit: number = 20): Promise<PokemonListResponse> => {
  const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};

// This function will return a pokemon by name
export const getPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${name.toLowerCase()}`);
  return response.data;
};

// This function will return a pokemon by id
export const getPokemonById = async (id: number): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${id}`);
  return response.data;
};

// This function will return a list of pokemons by type
export const getPokemonsByType = async (type: string): Promise<Pokemon[]> => {
  const response = await api.get(`/type/${type}`);
  return response.data.pokemon.map((p: { pokemon: Pokemon }) => p.pokemon);
};

export {};