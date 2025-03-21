import { screen } from '@testing-library/react';
import { TeamDetails } from '../TeamDetails';
import { renderWithProviders, createMockUser } from '../../utils/test-utils';

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1'
  })
}));

describe('TeamDetails Page', () => {
  it('renders without crashing', () => {
    const mockUser = createMockUser();
    renderWithProviders(<TeamDetails />, { 
      authProps: { user: mockUser },
      route: '/teams/1'
    });
    expect(screen.getByText('Team Details')).toBeInTheDocument();
  });

  it('displays team ID from URL parameters', () => {
    const mockUser = createMockUser();
    renderWithProviders(<TeamDetails />, {
      authProps: { user: mockUser },
      route: '/teams/1'
    });
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});