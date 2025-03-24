import { supabase } from '../lib/supabase';
import { User } from '../types/auth.types';
import { profilesAPI } from './profilesAPI';

export interface CreateTeamData {
  team_name: string;
  team_description?: string;
  is_public?: boolean;
}

export interface AddPokemonData {
  pokemon_id: number;
  position: number;
  moves?: string[];
}

export const teamsAPI = {
  async createTeam(user: User, data: CreateTeamData) {
    // Ensure profile exists
    await profilesAPI.createProfile(user.id, user.email);

    const { data: team, error } = await supabase
      .from('teams')
      .insert({
        user_id: user.id,
        team_name: data.team_name,
        team_description: data.team_description,
        team_code: `${user.id}-${Date.now()}`,
        is_public: data.is_public ?? false
      })
      .select()
      .single();

    if (error) {
      console.error('Team creation error:', error);
      throw new Error('Failed to create team');
    }

    return team;
  },

  async addPokemonToTeam(teamId: string, data: AddPokemonData) {
    const { data: pokemon, error } = await supabase
      .from('team_pokemon')
      .insert({
        team_id: teamId,
        pokemon_id: data.pokemon_id,
        position: data.position,
        moves: data.moves ?? []
      })
      .select();

    if (error) throw error;
    return pokemon;
  },

  async getTeam(teamId: string) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_pokemon (*)
      `)
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTeams(userId: string) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_pokemon (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async removePokemonFromTeam(teamId: string, position: number) {
    const { error } = await supabase
      .from('team_pokemon')
      .delete()
      .match({ team_id: teamId, position });

    if (error) {
      console.error('Remove Pokemon error:', error);
      throw new Error('Failed to remove Pokemon from team');
    }
  },

  async getTeamByCode(code: string) {
    console.log('Fetching team with code:', code); // Add this for debugging
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_pokemon (
          pokemon_id,
          position
        )
      `)
      .eq('team_code', code)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error('Error fetching shared team:', error);
      throw new Error("This team doesn't exist or isn't public");
    }

    console.log('Fetched team data:', data); // Add this for debugging
    return data;
  },

  async updateTeamSharing(teamId: string, isPublic: boolean) {
    const { error } = await supabase
      .from('teams')
      .update({ is_public: isPublic })
      .eq('team_id', teamId);

    if (error) throw error;
  }
};