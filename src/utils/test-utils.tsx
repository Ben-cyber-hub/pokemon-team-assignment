import React from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Create a new QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        refetchOnWindowFocus: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    }
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
}

function customRender(
  ui: React.ReactElement,
  { withRouter = true, ...options }: CustomRenderOptions = {}
) {
  const testQueryClient = createTestQueryClient();
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    );

    return withRouter ? <BrowserRouter>{content}</BrowserRouter> : content;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient: testQueryClient,
  };
}

export * from '@testing-library/react';
export { customRender as render };

// Mocked data for testing purposes
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