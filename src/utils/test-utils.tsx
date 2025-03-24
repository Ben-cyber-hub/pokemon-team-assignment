import React, { ReactNode } from 'react'
import { 
  render, 
  renderHook,
  RenderOptions as TestingLibraryRenderOptions, 
  RenderResult,
  RenderHookOptions
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { Pokemon } from '../types/pokemon.types'
import { Team } from '../types/team.types'
import { User } from '../types/auth.types'

// Basic mock factories
export const createMockPokemon = (overrides?: Partial<Pokemon>): Pokemon => ({
  id: 1,
  name: 'bulbasaur',
  types: [{ type: { name: 'grass' } }],
  sprites: {
    front_default: 'mock-sprite-url',
    other: {
      'official-artwork': {
        front_default: 'mock-artwork-url'
      }
    }
  },
  ...overrides
})

export const createMockTeam = (overrides?: Partial<Team>): Team => ({
  team_id: 'test-team-id',
  user_id: 'test-user-id',
  team_name: 'Test Team',
  team_description: null,
  team_code: 'TEST123',
  is_public: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  team_pokemon: [],
  ...overrides
})

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  username: 'testuser',
  created_at: new Date().toISOString(),
  ...overrides
})

// Interface for custom render options
interface CustomRenderOptions extends Omit<TestingLibraryRenderOptions, 'wrapper'> {
  user?: User | null;
  routerProps?: Partial<MemoryRouterProps>;
  queryClient?: QueryClient;
}

// Provider component that can be used as a wrapper
export function ProvidersWrapper({
  children,
  user = null,
  routerProps = {},
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  })
}: {
  children: React.ReactNode;
  user?: User | null;
  routerProps?: Partial<MemoryRouterProps>;
  queryClient?: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={user}>
        <MemoryRouter {...routerProps}>
          {children}
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Function to render with providers
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { user, routerProps, queryClient, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <ProvidersWrapper 
        user={user} 
        routerProps={routerProps} 
        queryClient={queryClient}
      >
        {children}
      </ProvidersWrapper>
    ),
    ...renderOptions
  });
}

// In your test-utils.tsx, add this helper:
export function renderHookWithProviders<Result, Props>(
  renderCallback: (props: Props) => Result,
  options: Omit<RenderHookOptions<Props>, 'wrapper'> & CustomRenderOptions = {} as any
) {
  const { queryClient = new QueryClient(), user, routerProps, ...renderOptions } = options;
  
  return renderHook(renderCallback, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={user}>
          <MemoryRouter {...routerProps}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    ),
    ...renderOptions
  });
}

export * from '@testing-library/react'