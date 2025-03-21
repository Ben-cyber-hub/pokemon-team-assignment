import { screen, fireEvent } from '@testing-library/react';
import NavBar from '../NavBar';
import { renderWithProviders } from '../../../utils/test-utils';
import { createMockUser } from '../../../utils/test-utils';

describe('NavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    it('renders public navigation links', () => {
      renderWithProviders(<NavBar />);
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pokédex/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /my teams/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });
  });

  describe('When user is authenticated', () => {
    it('renders authenticated navigation links', () => {
      const mockUser = createMockUser();
      renderWithProviders(<NavBar />, { 
        authProps: { user: mockUser } 
      });
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pokédex/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /my teams/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });

    it('calls signOut when logout button is clicked', () => {
      const mockUser = createMockUser();
      const { authContext } = renderWithProviders(<NavBar />, {
        authProps: { user: mockUser }
      });
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      expect(authContext.signOut).toHaveBeenCalledTimes(1);
    });
  });
});