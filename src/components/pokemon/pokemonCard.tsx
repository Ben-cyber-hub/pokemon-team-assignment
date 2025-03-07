import { ReactElement } from 'react';
import { Pokemon } from '../../types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps): ReactElement => {
  return (
    <div className="rounded-lg shadow-md p-4">
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
    </div>
  );
};