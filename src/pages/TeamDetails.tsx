import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import { useSharedTeam } from '../hooks/useSharedTeam';
import { PokemonCard } from '../components/pokemon/pokemonCard';
import { usePokemonDetails } from '../hooks/usePokemon';
import { TeamPokemon } from '../types/team.types';
import { TeamCoverage } from '../components/teams/TeamCoverage';
import { ShareTeamModal } from '../components/teams/ShareTeamModal';

export const TeamDetails = () => {
  const { id, code } = useParams<{ id?: string; code?: string }>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isSharedView = !!code;

  const { 
    team: ownedTeam, 
    isLoadingTeam: isLoadingOwned,
    updateTeamSharing 
  } = useTeams(id);

  const { 
    team: sharedTeam, 
    isLoading: isLoadingShared 
  } = useSharedTeam(code ?? '');

  // Use the appropriate team and loading state
  const team = isSharedView ? sharedTeam : ownedTeam;
  const isLoading = isSharedView ? isLoadingShared : isLoadingOwned;

  if (isLoading) {
    return <div className="text-center">Loading team...</div>;
  }

  if (!team) {
    return (
      <div className="text-center text-red-600">
        {isSharedView ? 
          "This team doesn't exist or isn't public" : 
          "Team not found"
        }
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{team.team_name}</h1>
          {team.team_description && (
            <p className="text-gray-600">{team.team_description}</p>
          )}
        </div>
        {!isSharedView && (
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Share Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = team.team_pokemon?.find((p: TeamPokemon) => p.position === index + 1);
          
          if (pokemon) {
            return (
              <TeamPokemonCard 
                key={index} 
                pokemonId={pokemon.pokemon_id} 
                position={index + 1} 
                teamId={team.team_id}
                isSharedView={isSharedView}
              />
            );
          }

          return isSharedView ? (
            <div 
              key={index} 
              className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-400">Empty slot</span>
            </div>
          ) : (
            <EmptySlot 
              key={index}
              position={index + 1}
              teamId={team.team_id}
            />
          );
        })}
      </div>

      {team.team_pokemon && team.team_pokemon.length > 0 && (
        <TeamCoverage teamPokemon={team.team_pokemon} />
      )}

      {!isSharedView && updateTeamSharing && (
        <ShareTeamModal
          team={team}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onUpdateSharing={(isPublic) => updateTeamSharing.mutateAsync(isPublic)}
        />
      )}
    </div>
  );
};

const TeamPokemonCard = ({ pokemonId, position, teamId, isSharedView }: { 
  pokemonId: number;
  position: number;
  teamId: string;
  isSharedView: boolean;
}) => {
  const { data: pokemon, isLoading } = usePokemonDetails(pokemonId);

  if (isLoading || !pokemon) {
    return <PokemonCard pokemon={null} />;
  }

  return (
    <div className="relative group">
      <PokemonCard pokemon={pokemon} />
      {!isSharedView && (
        <RemoveButton position={position} teamId={teamId} />
      )}
    </div>
  );
};

const RemoveButton = ({ position, teamId }: { position: number; teamId: string }) => {
  const { removePokemon } = useTeams(teamId);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <button
      onClick={async () => {
        if (!removePokemon) {
          console.error('Remove Pokemon mutation not available');
          return;
        }
        try {
          setIsRemoving(true);
          await removePokemon.mutateAsync(position);
        } catch (error) {
          console.error('Failed to remove Pokemon:', error);
        } finally {
          setIsRemoving(false);
        }
      }}
      disabled={isRemoving || !removePokemon}
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 
               flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Remove Pokemon"
    >
      ×
    </button>
  );
};

const EmptySlot = ({ position, teamId }: { position: number; teamId: string }) => {
  const [pokemonId, setPokemonId] = useState('');
  const { addPokemon } = useTeams(teamId);

  const handleAddPokemon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPokemon) return;
    
    const id = parseInt(pokemonId);
    if (!id || id < 1 || id > 1010) return;

    try {
      await addPokemon.mutateAsync({ 
        pokemon_id: id, 
        position 
      });
      setPokemonId('');
    } catch (error) {
      console.error('Failed to add Pokemon:', error);
    }
  };

  if (!addPokemon) return null;

  return (
    <form 
      onSubmit={handleAddPokemon}
      className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4"
    >
      <input
        type="number"
        min="1"
        max="1010"
        value={pokemonId}
        onChange={(e) => setPokemonId(e.target.value)}
        placeholder="Enter ID (1-1010)"
        className="w-full px-3 py-2 border rounded text-sm mb-2"
      />
      <button
        type="submit"
        disabled={!pokemonId}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
};