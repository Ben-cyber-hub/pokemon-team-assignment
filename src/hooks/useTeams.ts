import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsAPI, CreateTeamData } from '../services/teamsAPI';
import { useAuth } from '../contexts/AuthContext';

// Define interfaces for mutation data
interface AddPokemonMutationData {
  pokemon_id: number;
  position: number;
}

export function useTeams(teamId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: team, isLoading: isLoadingTeam } = useQuery(
    ['team', teamId],
    () => teamsAPI.getTeam(teamId!),
    { 
      enabled: !!teamId,
      retry: 1
    }
  );

  // Query for user's teams
  const { data: userTeams, isLoading: isLoadingTeams } = useQuery(
    ['teams', user?.id],
    () => teamsAPI.getUserTeams(user!.id),
    {
      enabled: !!user,
    }
  );

  const createTeam = useMutation({
    mutationFn: (data: CreateTeamData) => 
      teamsAPI.createTeam(user!, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams', user?.id]);
    }
  });

  // Always define mutations with proper types
  const addPokemon = useMutation({
    mutationFn: (data: AddPokemonMutationData) => 
      teamsAPI.addPokemonToTeam(teamId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team', teamId]);
    }
  });

  const removePokemon = useMutation({
    mutationFn: (position: number) => 
      teamsAPI.removePokemonFromTeam(teamId!, position),
    onSuccess: () => {
      queryClient.invalidateQueries(['team', teamId]);
    }
  });

  const updateTeamSharing = useMutation({
    mutationFn: (isPublic: boolean) => 
      teamsAPI.updateTeamSharing(teamId!, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries(['team', teamId]);
    }
  });

  return {
    team,
    userTeams,
    isLoadingTeam,
    isLoadingTeams,
    createTeam,
    ...((teamId) ? {
      addPokemon,
      removePokemon,
      updateTeamSharing
    } : {})
  };
}