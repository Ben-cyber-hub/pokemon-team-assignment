import { useState, FormEvent } from 'react';
import { useTeams } from '../../hooks/useTeams';

interface EmptySlotProps {
  position: number;
  teamId: string;
}

export const EmptySlot = ({ position, teamId }: EmptySlotProps) => {
  const [pokemonId, setPokemonId] = useState('');
  const { addPokemon } = useTeams(teamId);
  const [error, setError] = useState<string | null>(null);

  const handleAddPokemon = async (e: FormEvent) => {
    e.preventDefault();
    if (!addPokemon) return;
    setError(null);
    
    const id = parseInt(pokemonId);
    if (!id || id < 1 || id > 1010) {
      setError('Please enter a valid Pokémon ID (1-1010)');
      return;
    }

    try {
      await addPokemon.mutateAsync({ pokemon_id: id, position });
      setPokemonId('');
    } catch (error) {
      setError('Failed to add Pokémon');
      console.error('Failed to add Pokemon:', error);
    }
  };

  if (!addPokemon) return null;

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