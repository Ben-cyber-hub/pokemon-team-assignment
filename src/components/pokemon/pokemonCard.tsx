import { ReactElement } from 'react';
import { Pokemon } from '../../types/pokemon.types';
import { PlaceholderCard } from './PlaceholderCard';
import '../../styles/pokemon-types.css';

interface PokemonCardProps {
  /** Pokemon data to display. Null triggers placeholder */
  pokemon: Pokemon | null;
  /** Optional click handler for interactive cards */
  onClick?: (pokemon: Pokemon) => void;
}

/**
 * PokemonCard Component
 * 
 * Displays Pokemon information in a card format.
 * Shows a loading placeholder when pokemon data is null.
 * Can be interactive when onClick handler is provided.
 */
export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps): ReactElement => {
  if (!pokemon) {
    return <PlaceholderCard />;
  }

  const { sprites, name, id, types } = pokemon;
  const imageUrl = sprites.other?.['official-artwork'].front_default || sprites.front_default;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={() => onClick?.(pokemon)}
      role={onClick ? 'button' : 'article'}
      aria-label={`Pokemon ${name}`}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Pokemon Image */}
      <div className="w-full aspect-square">
        <img
          src={imageUrl}
          alt={`${name} official artwork`}
          className="w-full h-full object-contain p-1"
          loading="lazy"
        />
      </div>

      {/* Pokemon Details */}
      <div className="mt-1 text-center space-y-1">
        <h3 className="text-sm font-semibold capitalize">{name}</h3>
        <p className="text-xs text-gray-600">#{id.toString().padStart(3, '0')}</p>
        
        {/* Pokemon Types */}
        {types && types.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {types.map(({ type }) => (
              <span 
                key={type.name}
                className={`
                  px-2 py-0.5 text-xs rounded-full font-medium capitalize
                  bg-type-${type.name} text-white
                `}
              >
                {type.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};