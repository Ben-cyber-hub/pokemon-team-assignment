import { render, screen } from '@testing-library/react'
import { PokemonCard } from '../pokemonCard'
import { renderWithProviders, createMockPokemon } from '../../../utils/test-utils'

describe('PokemonCard', () => {
  const mockPokemon = createMockPokemon({
    id: 1,
    name: 'bulbasaur',
    types: [{ type: { name: 'grass' } }],
    sprites: {
      front_default: '/bulbasaur.png',
      other: {
        'official-artwork': {
          front_default: '/bulbasaur-artwork.png'
        }
      }
    }
  })

  it('displays pokemon name', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
  })

  it('displays pokemon image', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />)
    const image = screen.getByAltText('bulbasaur official artwork')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/bulbasaur-artwork.png')
  })

  it('displays pokemon type', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('grass')).toBeInTheDocument()
  })

  it('renders with pokemon data', () => {
    const { container } = renderWithProviders(<PokemonCard pokemon={mockPokemon} />)
    expect(container).toBeTruthy()
  })

  it('renders with null pokemon data', () => {
    const { container } = renderWithProviders(<PokemonCard pokemon={null} />)
    expect(container).toBeTruthy()
  })
})