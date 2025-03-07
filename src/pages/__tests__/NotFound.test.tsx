import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFound } from '../NotFound';

describe('NotFound Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});