import { screen, fireEvent } from '@testing-library/react'
import { PaginationControls } from '../PaginationControls'
import { renderWithProviders } from '../../../utils/test-utils'

describe('PaginationControls', () => {
  const defaultProps = {
    page: 1,
    setPage: jest.fn(),
    totalPages: 10,
    pageSize: 20
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pagination controls with current page', () => {
    renderWithProviders(<PaginationControls {...defaultProps} />)
    
    expect(screen.getByText(/Page/i)).toBeInTheDocument()
    expect(screen.getByText(/of 10/i)).toBeInTheDocument()
  })

  it('disables Previous button on first page', () => {
    renderWithProviders(<PaginationControls {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  })

  it('handles direct page input', async () => {
    renderWithProviders(<PaginationControls {...defaultProps} />)
    
    const input = screen.getByRole('spinbutton')
    // Be more specific with the selector to avoid multiple matches
    const goButton = screen.getByRole('button', { name: 'Go' }) 

    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(goButton)

    expect(defaultProps.setPage).toHaveBeenCalledWith(5)
  })

  it('shows error for invalid page number', async () => {
    renderWithProviders(<PaginationControls {...defaultProps} />)
    
    const input = screen.getByRole('spinbutton');
    // Add data-testid to your Go button in the component
    const goButton = screen.getByText('Go');

    // Set directly to invalid value
    fireEvent.change(input, { target: { value: '999' } });
    
    // Use form submission instead of clicking the button
    const form = screen.getByRole('form', { name: 'Go to page form' });
    fireEvent.submit(form);

    // Wait for the error message
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/Please enter a number between/);
  })

  it('updates page on Previous/Next clicks', () => {
    renderWithProviders(<PaginationControls {...defaultProps} page={2} />)
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    fireEvent.click(prevButton)
    expect(defaultProps.setPage).toHaveBeenCalledWith(1)

    fireEvent.click(nextButton)
    expect(defaultProps.setPage).toHaveBeenCalledWith(3)
  })

  it('renders with basic props', () => {
    const { container } = renderWithProviders(<PaginationControls {...defaultProps} />)
    expect(container).toBeTruthy()
  })

  it('renders with different page values', () => {
    const { container } = renderWithProviders(
      <PaginationControls {...defaultProps} page={5} totalPages={20} />
    )
    expect(container).toBeTruthy()
  })
})