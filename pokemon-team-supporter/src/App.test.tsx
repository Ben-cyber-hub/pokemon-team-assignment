import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders navigation', () => {
    render(<App />);
    expect(screen.getByText('Pokemon Teams')).toBeInTheDocument();
  });

  it('renders main container', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});