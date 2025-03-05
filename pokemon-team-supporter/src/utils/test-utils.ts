export const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  types: [{ 
    slot: 1,
    type: { 
      name: 'grass',
      url: 'https://pokeapi.co/api/v2/type/12/'
    } 
  }],
  stats: [
    { 
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/'
      }
    }
  ],
  sprites: {
    front_default: 'mock-sprite-url'
  }
};