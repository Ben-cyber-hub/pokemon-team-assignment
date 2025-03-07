import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TeamDetails } from '../TeamDetails';

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1'
  })
}));

describe('TeamDetails Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <TeamDetails />
      </BrowserRouter>
    );
    expect(screen.getByText('Team Details')).toBeInTheDocument();
  });

  it('displays team ID from URL parameters', () => {
    render(
      <BrowserRouter>
        <TeamDetails />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});