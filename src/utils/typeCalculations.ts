import { POKEMON_TYPES } from '../constants/pokemon';

export type PokemonType = typeof POKEMON_TYPES[number];

interface TypeEffectiveness {
  weakTo: PokemonType[];
  resistantTo: PokemonType[];
  immuneTo: PokemonType[];
}

export const TYPE_EFFECTIVENESS: Record<PokemonType, TypeEffectiveness> = {
  normal: {
    weakTo: ['fighting'],
    resistantTo: [],
    immuneTo: ['ghost']
  },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo: []
  },
  water: {
    weakTo: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
    immuneTo: []
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
    immuneTo: []
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
    immuneTo: []
  },
  ice: {
    weakTo: ['fire', 'fighting', 'rock', 'steel'],
    resistantTo: ['ice'],
    immuneTo: []
  },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
    immuneTo: []
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo: []
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric']
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground']
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
    immuneTo: []
  },
  bug: {
    weakTo: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
    immuneTo: []
  },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
    immuneTo: []
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting']
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
    immuneTo: []
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic']
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immuneTo: ['poison']
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon']
  }
};

export interface TeamTypeAnalysis {
  weaknesses: Map<PokemonType, number>;
  resistances: Map<PokemonType, number>;
  immunities: Set<PokemonType>;
  coverage: Map<PokemonType, number>;
  defensiveAnalysis: {
    score: number;
    criticalWeaknesses: PokemonType[];
    uncoveredTypes: PokemonType[];
  };
}

export function calculateTypeEffectiveness(attackingType: PokemonType, defendingTypes: PokemonType[]): number {
  let multiplier = 1;

  defendingTypes.forEach(defType => {
    if (TYPE_EFFECTIVENESS[attackingType].weakTo.includes(defType)) {
      multiplier *= 2;
    }
    if (TYPE_EFFECTIVENESS[attackingType].resistantTo.includes(defType)) {
      multiplier *= 0.5;
    }
    if (TYPE_EFFECTIVENESS[attackingType].immuneTo.includes(defType)) {
      multiplier = 0;
    }
  });

  return multiplier;
}

export function analyzeTeamTypes(types: PokemonType[][]): TeamTypeAnalysis {
  const analysis: TeamTypeAnalysis = {
    weaknesses: new Map(),
    resistances: new Map(),
    immunities: new Set(),
    coverage: new Map(),
    defensiveAnalysis: {
      score: 0,
      criticalWeaknesses: [],
      uncoveredTypes: []
    }
  };

  // Handle each Pokémon's type combination
  types.forEach(pokemonTypes => {
    POKEMON_TYPES.forEach(attackingType => {
      const effectiveness = calculateTypeEffectiveness(attackingType, pokemonTypes);
      
      if (effectiveness > 1) {
        analysis.weaknesses.set(attackingType, 
          (analysis.weaknesses.get(attackingType) || 0) + 1
        );
      } else if (effectiveness < 1 && effectiveness > 0) {
        analysis.resistances.set(attackingType,
          (analysis.resistances.get(attackingType) || 0) + 1
        );
      } else if (effectiveness === 0) {
        analysis.immunities.add(attackingType);
      }
    });

    // Calculate offensive coverage
    pokemonTypes.forEach(type => {
      TYPE_EFFECTIVENESS[type].weakTo.forEach(covered => {
        analysis.coverage.set(covered,
          (analysis.coverage.get(covered) || 0) + 1
        );
      });
    });
  });

  // Add defensive scoring
  let totalScore = 0;
  POKEMON_TYPES.forEach(type => {
    const weakCount = analysis.weaknesses.get(type) || 0;
    const resistCount = analysis.resistances.get(type) || 0;
    const isImmune = analysis.immunities.has(type);

    // Calculate score: resistances and immunities boost score, weaknesses reduce it
    const typeScore = (resistCount * 1) + (isImmune ? 2 : 0) - (weakCount * 1.5);
    totalScore += typeScore;

    // Track critical weaknesses (2 or more Pokémon weak to same type)
    if (weakCount >= 2) {
      analysis.defensiveAnalysis.criticalWeaknesses.push(type);
    }

    // Track uncovered types (no resistance or immunity)
    if (resistCount === 0 && !isImmune) {
      analysis.defensiveAnalysis.uncoveredTypes.push(type);
    }
  });

  analysis.defensiveAnalysis.score = totalScore / POKEMON_TYPES.length;

  return analysis;
}