import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { CreateTeamModal } from '../components/teams';

export const Teams = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { userTeams, isLoadingTeams, createTeam } = useTeams();

  const handleCreateTeam = async (data: { team_name: string; team_description?: string }) => {
    try {
      await createTeam.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error; // This will be caught by the modal's error handling
    }
  }; 

  if (isLoadingTeams) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          Create Team
        </button>
      </div>

      {userTeams?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userTeams.map((team) => (
            <Link
              key={team.team_id}
              to={`/teams/${team.team_id}`}
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{team.team_name}</h3>
              {team.team_description && (
                <p className="text-gray-600 text-sm mb-3">{team.team_description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{team.team_pokemon?.length || 0} Pokémon</span>
                <span>{team.is_public ? 'Public' : 'Private'}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          No teams yet. Create your first team!
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
        isLoading={createTeam.isLoading}
      />
    </div>
  );
};