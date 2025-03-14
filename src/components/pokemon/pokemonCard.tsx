import { ReactElement } from 'react';
import { Pokemon } from '../../types/pokemon.types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps): ReactElement => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(pokemon)}
    >
      <div className="w-full aspect-square">
        <img
          src={pokemon.sprites.other?.['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain p-1"
        />
      </div>
      <div className="mt-1 text-center">
        <h3 className="text-sm font-semibold capitalize">{pokemon.name}</h3>
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {pokemon.types.map((type) => (
            <span 
              key={type.type.name}
              className="px-1.5 py-0.5 rounded text-xs text-white bg-blue-500"
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};