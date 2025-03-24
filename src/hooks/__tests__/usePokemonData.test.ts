import { renderHook } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { usePokemonData } from '../usePokemonData';
import * as pokemonAPI from '../../services/pokemonAPI';

// Mock the Pokemon API
jest.mock('../../services/pokemonAPI', () => ({
  getPokemonList: jest.fn(),
  getPokemonByName: jest.fn()
}));

// Simple mock data
const mockPokemonList = {
  count: 1,
  next: null,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
  ]
};

// Create a custom render function to avoid JSX in tests
function createWrapper(client: QueryClient) {
  // Return a wrapper function
  return function Wrapper({ children }: any) {
    const QueryClientProvider = require('@tanstack/react-query').QueryClientProvider;
    const createElement = require('react').createElement;
    return createElement(
      QueryClientProvider, 
      { client }, 
      children
    );
  };
}

describe('usePokemonData', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }
      }
    });
    
    (pokemonAPI.getPokemonList as jest.Mock).mockResolvedValue(mockPokemonList);
  });

  // Simple test to check that the hook works
  test('can be rendered', () => {
    const wrapper = createWrapper(queryClient);
    
    // Provide the required parameters to usePokemonData
    const { result } = renderHook(() => usePokemonData({ 
      searchTerm: '', 
      page: 1, 
      pageSize: 20 
    }), { wrapper });
    
    // Check that we get a result with the expected structure
    expect(result.current).toHaveProperty('pokemon');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
  });
});