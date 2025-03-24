import { screen, waitFor } from '@testing-library/react'
import { ProtectedRoute } from '../ProtectedRoute'
import { renderWithProviders, createMockUser } from '../../../utils/test-utils'
import * as AuthContext from '../../../contexts/AuthContext'

// Define mockNavigate at the top level
const mockNavigate = jest.fn();

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    Navigate: (props: { to: string }) => {
      mockNavigate(props.to);
      return null;
    }
  };
});

// Create a properly typed mock auth object that matches the actual AuthContextType
const createAuthMock = (overrides = {}) => {
  return {
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn().mockResolvedValue({ needsEmailConfirmation: false }),
    signOut: jest.fn(),
    isAuthenticated: false,
    ...overrides
  };
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    jest.clearAllMocks();
  });

  it('shows loading state when checking authentication', () => {
    // Mock the returned value from useAuth with loading=true
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue(
      createAuthMock({ loading: true })
    );

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Look for loading indicator
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    const mockUser = createMockUser();
    
    // Mock authenticated user
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue(
      createAuthMock({ 
        user: mockUser, 
        loading: false, 
        isAuthenticated: true 
      })
    );
    
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    // Mock unauthenticated user with completed loading
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue(
      createAuthMock({
        user: null,
        loading: false,
        isAuthenticated: false
      })
    );

    // Simple render - no act needed
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Allow some time for navigation to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 2000 });
  });
});