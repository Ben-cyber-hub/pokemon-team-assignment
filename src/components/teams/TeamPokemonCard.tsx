import { ReactElement } from 'react';
import { PokemonCard } from '../pokemon/pokemonCard';
import { usePokemonDetails } from '../../hooks/usePokemon';
import { RemoveButton } from './RemoveButton';  // Updated import path

/**
 * Props for the TeamPokemonCard component
 */
interface TeamPokemonCardProps {
  /** The unique identifier of the Pokemon */
  pokemonId: number;
  /** The position of the Pokemon in the team (1-6) */
  position: number;
  /** The unique identifier of the team */
  teamId: string;
  /** Whether the card is being viewed in shared mode */
  isSharedView: boolean;
}

/**
 * TeamPokemonCard Component
 * 
 * Displays a Pokemon card within a team context, optionally showing
 * a remove button when not in shared view mode.
 * 
 * @example
 * ```tsx
 * <TeamPokemonCard
 *   pokemonId={25}
 *   position={1}
 *   teamId="team-123"
 *   isSharedView={false}
 * />
 * ```
 */
export const TeamPokemonCard = ({ 
  pokemonId, 
  position, 
  teamId, 
  isSharedView 
}: TeamPokemonCardProps): ReactElement => {
  // Fetch Pokemon details from the API
  const { data: pokemon, isLoading } = usePokemonDetails(pokemonId);

  // Show loading state while fetching Pokemon data
  if (isLoading || !pokemon) {
    return <PokemonCard pokemon={null} />;
  }

  return (
    <div className="relative group">
      {/* Pokemon card display */}
      <PokemonCard pokemon={pokemon} />
      
      {/* Remove button - only shown when not in shared view */}
      {!isSharedView && (
        <RemoveButton 
          position={position} 
          teamId={teamId} 
        />
      )}
    </div>
  );
};