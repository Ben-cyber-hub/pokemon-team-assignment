export interface Team {
  id: string;
  userId: string;
  name: string;
  description?: string;
  pokemon: TeamPokemon[];
  isPublic: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamPokemon {
  pokemonId: number;
  position: number;
  moves: string[];
}