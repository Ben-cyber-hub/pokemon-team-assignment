import { screen } from '@testing-library/react';
import { NotFound } from '../NotFound';
import { renderWithProviders } from '../../utils/test-utils';

describe('NotFound Page', () => {
  it('renders without crashing', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});