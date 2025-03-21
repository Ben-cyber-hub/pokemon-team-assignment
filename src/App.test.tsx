import { screen } from '@testing-library/react';
import { App } from './App';
import { renderWithProviders, createMockUser } from './utils/test-utils';

// Mock the components
jest.mock('./components/layout/NavBar', () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navigation Bar</nav>
}));

jest.mock('./pages/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>
}));

jest.mock('./pages/Pokedex', () => ({
  Pokedex: () => <div data-testid="pokedex-page">Pokedex Page</div>
}));

jest.mock('./pages/Teams', () => ({
  Teams: () => <div data-testid="teams-page">Teams Page</div>
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic layout structure', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('app-root')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders home page by default', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });

  it('renders pokedex page on /pokedex route', () => {
    renderWithProviders(<App />, { route: '/pokedex' });
    
    expect(screen.getByTestId('pokedex-page')).toBeInTheDocument();
  });

  it('handles protected routes when user is not authenticated', () => {
    renderWithProviders(<App />, { route: '/teams' });
    expect(screen.queryByTestId('teams-page')).not.toBeInTheDocument();
  });

  it('handles protected routes when user is authenticated', () => {
    const mockUser = createMockUser();
    renderWithProviders(<App />, { 
      route: '/teams',
      authProps: { user: mockUser }
    });
    
    expect(screen.getByTestId('teams-page')).toBeInTheDocument();
  });
});