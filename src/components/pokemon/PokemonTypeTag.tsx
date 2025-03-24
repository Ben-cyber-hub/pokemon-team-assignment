import { PokemonType } from '../../utils/typeCalculations';

interface PokemonTypeTagProps {
  type: PokemonType;
  size?: 'sm' | 'md';
}

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300'
};

export const PokemonTypeTag = ({ type, size = 'md' }: PokemonTypeTagProps) => {
  const baseClasses = `inline-flex items-center justify-center rounded-full text-white font-medium capitalize`;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <span className={`${baseClasses} ${sizeClasses} ${TYPE_COLORS[type]}`}>
      {type}
    </span>
  );
};