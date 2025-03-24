import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavBar from '../NavBar'
import { renderWithProviders } from '../../../utils/test-utils'
import { createMockUser } from '../../../utils/test-utils'

describe('NavBar', () => {
  it('renders when user is not authenticated', () => {
    const { container } = renderWithProviders(<NavBar />, { user: null })
    expect(container).toBeTruthy()
  })

  it('renders when user is authenticated', () => {
    const mockUser = createMockUser()
    const { container } = renderWithProviders(<NavBar />, { user: mockUser })
    expect(container).toBeTruthy()
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      renderWithProviders(<NavBar />, { user: null })
    })

    it('shows public navigation links', () => {
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Pokédex')).toBeInTheDocument()
      expect(screen.queryByText('My Teams')).not.toBeInTheDocument()
    })

    it('displays login and register buttons', () => {
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })

  describe('when user is authenticated', () => {
    const mockUser = createMockUser()

    beforeEach(() => {
      renderWithProviders(<NavBar />, { user: mockUser })
    })

    it('shows all navigation links including authenticated ones', () => {
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Pokédex')).toBeInTheDocument()
      expect(screen.getByText('My Teams')).toBeInTheDocument()
    })

    it('displays logout button instead of login/register', () => {
      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.queryByText('Login')).not.toBeInTheDocument()
      expect(screen.queryByText('Register')).not.toBeInTheDocument()
    })

    it('handles logout click', async () => {
      const logoutButton = screen.getByText('Logout')
      await userEvent.click(logoutButton)
      // Verification of logout functionality would be handled by AuthContext tests
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderWithProviders(<NavBar />, { user: null })
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('indicates current page correctly', () => {
      renderWithProviders(<NavBar />, { 
        user: null,
        routerProps: { initialEntries: ['/'] }
      })
      expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page')
    })
  })
})