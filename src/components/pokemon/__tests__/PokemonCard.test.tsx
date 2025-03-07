import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PokemonCard } from '../pokemonCard';
import { mockPokemon } from '../../../utils/test-utils';

describe('PokemonCard', () => {
  it('renders pokemon name', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('renders pokemon image', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mock-sprite-url');
  });
});