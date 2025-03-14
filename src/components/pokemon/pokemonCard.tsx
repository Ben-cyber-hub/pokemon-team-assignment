import { ReactElement } from 'react';
import { Pokemon } from '../../types/pokemon.types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps): ReactElement => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(pokemon)}
    >
      <div className="w-full aspect-square">
        <img
          src={pokemon.sprites.other?.['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mt-2">
        <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
        <div className="flex gap-2 mt-1">
          {pokemon.types.map((type) => (
            <span 
              key={type.type.name}
              className="px-2 py-1 rounded text-sm text-white bg-blue-500"
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};