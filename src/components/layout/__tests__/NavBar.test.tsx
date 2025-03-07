import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar';

describe('NavBar', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
  });

  it('renders the logo text', () => {
    expect(screen.getByText('Pokemon Teams')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    expect(screen.getByText('Pokedex')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
  });

  it('renders the Pokeball image', () => {
    expect(screen.getByAltText('Pokeball')).toBeInTheDocument();
  });
});