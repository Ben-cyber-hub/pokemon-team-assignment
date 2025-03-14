import { render, screen, waitFor, fireEvent } from '../../utils/test-utils';
import { Pokedex } from '../Pokedex';
import { getPokemonList, getPokemonByName, searchPokemon } from '../../services/pokemonAPI';

// Mock the API module
jest.mock('../../services/pokemonAPI', () => ({
  getPokemonList: jest.fn(),
  getPokemonByName: jest.fn(),
  searchPokemon: jest.fn(),
  getPokemonById: jest.fn()
}));

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  types: [{ slot: 1, type: { name: 'grass', url: '' } }],
  stats: [{ base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } }],
  sprites: {
    front_default: 'mockurl',
    other: { 'official-artwork': { front_default: 'mockurl' } }
  }
};

describe('Pokedex Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default successful responses
    (getPokemonList as jest.Mock).mockResolvedValue({
      results: [{ name: 'bulbasaur', url: 'pokemon/1' }],
      count: 1
    });
    (getPokemonByName as jest.Mock).mockResolvedValue(mockPokemon);
    (searchPokemon as jest.Mock).mockResolvedValue([mockPokemon]);
  });

  describe('Initial Loading State', () => {
    it('shows loading state initially', () => {
      (getPokemonList as jest.Mock).mockReturnValue(new Promise(() => {}));
      render(<Pokedex />);
      expect(screen.getByText(/loading pokémon/i)).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error state when Pokemon list fails to load', async () => {
      (getPokemonList as jest.Mock).mockRejectedValue(new Error('Failed to load'));
      render(<Pokedex />);
      await waitFor(() => {
        expect(screen.getByText(/error loading pokémon/i)).toBeInTheDocument();
      });
    });
  });

  describe('Successful Load', () => {
    it('renders pokemon list with controls', async () => {
      render(<Pokedex />);
      
      await waitFor(() => {
        // Check for main components
        expect(screen.getByText(/pokédex/i)).toBeInTheDocument();
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
        
        // Check for filters
        expect(screen.getByLabelText(/generation/i)).toBeEnabled();
        expect(screen.getByLabelText(/type/i)).toBeEnabled();
        
        // Check for pagination (accounting for top and bottom controls)
        const previousButtons = screen.getAllByText('Previous');
        const nextButtons = screen.getAllByText('Next');
        const goButtons = screen.getAllByText('Go');
        
        expect(previousButtons).toHaveLength(2);
        expect(nextButtons).toHaveLength(2);
        expect(goButtons).toHaveLength(2);
        
        // Check that Previous is disabled on first page
        previousButtons.forEach(button => {
          expect(button).toBeDisabled();
        });
      });
    });
  });

  describe('Search Functionality', () => {
    it('handles search correctly', async () => {
      render(<Pokedex />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Get and use the search input
      const searchInput = screen.getByPlaceholderText(/search across all pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'bulb' } });

      // Wait for debounce and verify search was triggered
      await waitFor(() => {
        expect(searchPokemon).toHaveBeenCalledWith('bulb');
        // Verify filters are disabled during search
        expect(screen.getByLabelText(/generation/i)).toBeDisabled();
        expect(screen.getByLabelText(/type/i)).toBeDisabled();
        // Verify pagination is hidden during search
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      });

      // Verify search results are displayed
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    it('shows no results message when search finds nothing', async () => {
      (searchPokemon as jest.Mock).mockResolvedValue([]);
      render(<Pokedex />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Perform search
      const searchInput = screen.getByPlaceholderText(/search across all pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      // Verify no results message
      await waitFor(() => {
        expect(screen.getByText(/no pokémon found matching/i)).toBeInTheDocument();
      });
    });
  });
});