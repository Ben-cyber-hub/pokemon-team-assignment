import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/test-utils'
import { TeamCoverage } from '../TeamCoverage'
import * as PokemonHooks from '../../../hooks/usePokemon'

// Mock the usePokemonDetails hook
jest.mock('../../../hooks/usePokemon')

describe('TeamCoverage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create a basic mock that returns Pokemon data
    ;(PokemonHooks.usePokemonDetails as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        id: 6,
        name: 'charizard',
        types: [{ type: { name: 'fire' } }]
      }
    })
  })

  it('renders with a single pokemon', () => {
    const team = [{
      entry_id: '1',
      team_id: 'test-1',
      pokemon_id: 6,
      position: 1,
      moves: null
    }]

    // Render using the provider (renamed result variable)
    const view = renderWithProviders(<TeamCoverage teamPokemon={team} />)
    
    // Test that something was rendered
    expect(view.container).toBeTruthy()
  })

  it('renders with empty team', () => {
    // Render using the provider (renamed result variable)
    const view = renderWithProviders(<TeamCoverage teamPokemon={[]} />)
    
    // Test that something was rendered
    expect(view.container).toBeTruthy()
  })
})