import { useQuery } from '@tanstack/react-query';
import { teamsAPI } from '../services/teamsAPI';
import { Team } from '../types/team.types';

export function useSharedTeam(code: string) {
  const { data: team, isLoading, error } = useQuery<Team>(
    ['shared-team', code],
    async () => {
      if (!code) return null;
      const data = await teamsAPI.getTeamByCode(code);
      console.log('Shared team data:', data); // Add this for debugging
      return data;
    },
    {
      enabled: !!code,
      retry: 3,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  return { team, isLoading, error };
}