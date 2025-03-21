import { screen } from '@testing-library/react';
import { Home } from '../Home';
import { renderWithProviders } from '../../utils/test-utils';

describe('Home Page', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Pokemon Team Builder')).toBeInTheDocument();
  });
});