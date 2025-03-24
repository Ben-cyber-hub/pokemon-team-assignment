import { render, screen, fireEvent } from '@testing-library/react'
import { CreateTeamModal } from '../CreateTeamModal'

describe('CreateTeamModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(<CreateTeamModal {...defaultProps} />)
    expect(screen.getByText('Create New Team')).toBeInTheDocument()
  })

  it('allows team name input', () => {
    render(<CreateTeamModal {...defaultProps} />)
    const input = screen.getByLabelText('Team Name')
    fireEvent.change(input, { target: { value: 'My Test Team' } })
    expect(input).toHaveValue('My Test Team')
  })

  it('submits form with team data', () => {
    render(<CreateTeamModal {...defaultProps} />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText('Team Name'), { 
      target: { value: 'My Test Team' } 
    })
    
    // Submit form
    fireEvent.click(screen.getByText('Create Team'))
    
    // Check if onSubmit was called with correct data
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      team_name: 'My Test Team',
      team_description: ''
    })
  })

  it('shows loading state', () => {
    render(<CreateTeamModal {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Creating...')).toBeInTheDocument()
  })
})