import { useState } from 'react';
import { useTeams } from '../../hooks/useTeams';

interface RemoveButtonProps {
  position: number;
  teamId: string;
}

export const RemoveButton = ({ position, teamId }: RemoveButtonProps) => {
  const { removePokemon } = useTeams(teamId);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
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
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isRemoving || !removePokemon}
      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white 
                hover:bg-red-600 flex items-center justify-center opacity-0 
                group-hover:opacity-100 transition-opacity"
      aria-label="Remove Pokemon"
    >
      ×
    </button>
  );
};