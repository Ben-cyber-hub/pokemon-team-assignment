import { FormEvent, useState } from 'react';
import { useTeams } from '../../hooks/useTeams';

interface EmptySlotProps {
  position: number;
  teamId: string;
}

export const EmptySlot = ({ position, teamId }: EmptySlotProps) => {
  const [pokemonId, setPokemonId] = useState('');
  const [error, setError] = useState('');
  
  // Get all team-related functions from useTeams
  const { team, addPokemon } = useTeams(teamId);
  
  console.log('EmptySlot rendering:', { 
    position, 
    teamId, 
    hasAddPokemon: !!addPokemon,
    team: !!team
  });

  const handleAddPokemon = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!pokemonId) {
      setError('Please enter a Pokemon ID');
      return;
    }

    // Make sure addPokemon exists before trying to use it
    if (!addPokemon) {
      setError('Unable to add Pokemon - you may not have permission');
      return;
    }

    try {
      const id = parseInt(pokemonId, 10);
      console.log('Adding Pokemon:', { pokemon_id: id, position, teamId });
      await addPokemon.mutateAsync({ 
        pokemon_id: id, 
        position 
      });
      setPokemonId('');
      setError('');
    } catch (error) {
      setError('Failed to add Pokémon');
      console.error('Failed to add Pokemon:', error);
    }
  };

  if (!addPokemon) {
    console.log('No addPokemon function available for team:', teamId);
    return <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4 flex items-center justify-center text-gray-500">
      Empty Slot
    </div>;
  }

  return (
    <form 
      onSubmit={handleAddPokemon}
      className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed 
                border-gray-300 p-4 flex flex-col"
    >
      <div className="flex-1">
        <input
          type="number"
          min="1"
          max="1010"
          value={pokemonId}
          onChange={(e) => setPokemonId(e.target.value)}
          placeholder="Enter ID (1-1010)"
          className="w-full px-3 py-2 border rounded text-sm mb-2"
          aria-label="Pokemon ID"
        />
        {error && (
          <p className="text-red-500 text-xs mb-2">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={!pokemonId}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded 
                 hover:bg-orange-700 disabled:opacity-50 transition-colors"
      >
        Add
      </button>
    </form>
  );
};