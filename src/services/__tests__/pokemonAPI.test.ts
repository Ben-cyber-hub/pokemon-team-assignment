import { getPokemonList, getPokemonByName } from '../pokemonAPI'
import fetchMock from 'jest-fetch-mock'

describe('pokemonAPI', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('exports the expected functions', () => {
    expect(typeof getPokemonList).toBe('function')
    expect(typeof getPokemonByName).toBe('function')
  })
})