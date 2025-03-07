import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Pokedex } from '../Pokedex';

describe('Pokedex Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Pokedex />
      </BrowserRouter>
    );
    expect(screen.getByText('Pokedex')).toBeInTheDocument();
  });
});