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

  console.log('useTeams called with:', { teamId, userId: user?.id });

  const { data: team, isLoading: isLoadingTeam } = useQuery(
    ['team', teamId],
    () => teamsAPI.getTeam(teamId!),
    { 
      enabled: !!teamId && !!user,
      retry: 1
    }
  );

  // Log ownership status - this is crucial for debugging
  const isOwner = user && team && user.id === team.user_id;
  console.log('Team ownership check:', { isOwner, teamUserId: team?.user_id, userId: user?.id });

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

  // Modified return value to include edit functions ONLY if user is the team owner
  return {
    team,
    userTeams,
    isLoadingTeam,
    isLoadingTeams,
    createTeam,
    // Only include editing functions if teamId exists AND user is the owner
    ...((teamId && isOwner) ? {
      addPokemon,
      removePokemon,
      updateTeamSharing
    } : {})
  };
}