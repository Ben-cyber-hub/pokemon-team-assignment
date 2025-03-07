import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../Home';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Pokemon Team Builder')).toBeInTheDocument();
  });
});