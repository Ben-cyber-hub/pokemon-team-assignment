import { screen } from '@testing-library/react';
import { Teams } from '../Teams';
import { renderWithProviders, createMockUser } from '../../utils/test-utils';

describe('Teams Page', () => {
  it('renders without crashing', () => {
    const mockUser = createMockUser();
    renderWithProviders(<Teams />, { 
      authProps: { user: mockUser }
    });
    expect(screen.getByText('My Teams')).toBeInTheDocument();
  });
});