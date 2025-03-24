module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pokemon-type': {
          normal: 'var(--type-normal)',
          fire: 'var(--type-fire)',
          water: 'var(--type-water)',
          electric: 'var(--type-electric)',
          grass: 'var(--type-grass)',
          ice: 'var(--type-ice)',
          fighting: 'var(--type-fighting)',
          poison: 'var(--type-poison)',
          ground: 'var(--type-ground)',
          flying: 'var(--type-flying)',
          psychic: 'var(--type-psychic)',
          bug: 'var(--type-bug)',
          rock: 'var(--type-rock)',
          ghost: 'var(--type-ghost)',
          dragon: 'var(--type-dragon)',
          dark: 'var(--type-dark)',
          steel: 'var(--type-steel)',
          fairy: 'var(--type-fairy)',
        },
      },
    },
  },
  plugins: [],
}