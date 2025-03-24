import { renderHook } from '@testing-library/react'
import { useTeams } from '../useTeams'
import * as teamsAPI from '../../services/teamsAPI'
import { QueryClient } from '@tanstack/react-query'

// Mock the teams API
jest.mock('../../services/teamsAPI', () => ({
  teamsAPI: {
    getTeam: jest.fn()
  }
}))

// Create a custom render function to avoid JSX in tests
// Update the wrapper to include AuthProvider:
function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: any) {
    const QueryClientProvider = require('@tanstack/react-query').QueryClientProvider;
    const createElement = require('react').createElement;
    const { AuthProvider } = require('../../contexts/AuthContext');
    
    // Wrap with AuthProvider since useTeams depends on useAuth
    return createElement(
      QueryClientProvider, 
      { client }, 
      createElement(AuthProvider, { initialUser: { id: 'test-user-id' } }, children)
    );
  };
}

describe('useTeams', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }
      }
    });
    
    (teamsAPI.teamsAPI.getTeam as jest.Mock).mockResolvedValue([]);
  });

  test('can be rendered', () => {
    const wrapper = createWrapper(queryClient);
    
    const { result } = renderHook(() => useTeams(), { wrapper });
    
    // Update expectations to match actual hook implementation
    expect(result.current).toHaveProperty('userTeams');
    expect(result.current).toHaveProperty('isLoadingTeams');
    expect(result.current).toHaveProperty('createTeam');
  });
})