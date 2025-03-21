import { render, screen, waitFor, fireEvent } from '../../utils/test-utils';
import { Pokedex } from '../Pokedex';
import { getPokemonList, getPokemonByName } from '../../services/pokemonAPI';

jest.mock('../../services/pokemonAPI');

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  sprites: {
    front_default: 'mockurl',
    other: { 'official-artwork': { front_default: 'mockurl' } }
  }
};

describe('Pokedex Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getPokemonList as jest.Mock).mockResolvedValue({
      results: [{ name: 'bulbasaur', url: 'pokemon/1' }],
      count: 1,
      totalPages: 1,
      page: 1
    });
    (getPokemonByName as jest.Mock).mockResolvedValue(mockPokemon);
  });

  it('shows loading state initially', () => {
    render(<Pokedex />);
    expect(screen.getByText(/loading pokémon/i)).toBeInTheDocument();
  });

  it('renders pokemon list after loading', async () => {
    render(<Pokedex />);
    
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('handles search correctly', async () => {
    render(<Pokedex />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by pokémon name/i);
    fireEvent.change(searchInput, { target: { value: 'bulba' } });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('shows no results message when search finds nothing', async () => {
    render(<Pokedex />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by pokémon name/i);
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    await waitFor(() => {
      expect(screen.getByText(/no pokémon found matching/i)).toBeInTheDocument();
    });
  });
});