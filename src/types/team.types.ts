export interface TeamPokemon {
  entry_id: string;
  team_id: string;
  pokemon_id: number;
  position: number;
  moves: string[] | null;
}

export interface Team {
  team_id: string;
  user_id: string;
  team_name: string;
  team_description: string | null;
  team_code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  team_pokemon?: TeamPokemon[];
}