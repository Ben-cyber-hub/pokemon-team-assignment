import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Teams } from '../Teams';

describe('Teams Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Teams />
      </BrowserRouter>
    );
    expect(screen.getByText('My Teams')).toBeInTheDocument();
  });
});