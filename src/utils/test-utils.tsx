import React from 'react';
import { render, RenderOptions as RTLRenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { User } from '../types/auth.types';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const createMockUser = (): User => ({
  id: '1',
  email: 'test@test.com',
  username: 'test',
  created_at: new Date().toISOString()
});

// Custom render options extending RTL's options
interface CustomRenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
  route?: string;
  authProps?: {
    user?: User | null;
    loading?: boolean;
  };
}

// Custom render result including auth context
interface CustomRenderResult {
  authContext: jest.Mocked<AuthContextType>;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const queryClient = createTestQueryClient();
  
  // Create mock auth context with Jest mock functions
  const mockAuthContext: jest.Mocked<AuthContextType> = {
    user: options?.authProps?.user ?? null,
    loading: options?.authProps?.loading ?? false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        {options?.route ? (
          <MemoryRouter initialEntries={[options.route]}>
            {children}
          </MemoryRouter>
        ) : (
          <BrowserRouter>{children}</BrowserRouter>
        )}
      </AuthContext.Provider>
    </QueryClientProvider>
  );

  const renderResult = render(ui, { wrapper: Wrapper, ...options });

  return {
    ...renderResult,
    authContext: mockAuthContext,
  } as typeof renderResult & CustomRenderResult;
};

// Export testing utilities
export * from '@testing-library/react';
export { renderWithProviders as render };

// Mock Pokemon data for testing
export const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  types: [{ 
    slot: 1,
    type: { 
      name: 'grass',
      url: 'https://pokeapi.co/api/v2/type/12/'
    } 
  }],
  stats: [
    { 
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/'
      }
    }
  ],
  sprites: {
    front_default: 'mock-sprite-url'
  }
};