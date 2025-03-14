// Definition of the types used in the Pokemon API service
// This file will be used to define the types of the data that we will be using in the Pokemon API service.
export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: {
      front_default: string;
      back_default?: string;
      front_shiny?: string;
      back_shiny?: string;
      other?: {
          'official-artwork': {
              front_default: string;
          }
      }
  };
  height?: number;
  weight?: number;
  abilities?: PokemonAbility[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
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
  results: {
      name: string;
      url: string;
  }[];
}