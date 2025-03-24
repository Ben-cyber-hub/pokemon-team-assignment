import { useMemo } from 'react';
import { Pokemon } from '../../types/pokemon.types';
import { TeamPokemon } from '../../types/team.types';
import { usePokemonDetails } from '../../hooks/usePokemon';
import { analyzeTeamTypes, PokemonType } from '../../utils/typeCalculations';

interface TeamCoverageProps {
  teamPokemon: TeamPokemon[];
}

export const TeamCoverage = ({ teamPokemon }: TeamCoverageProps) => {
  // Use individual hooks for each Pokemon
  const pokemon1 = usePokemonDetails(teamPokemon[0]?.pokemon_id);
  const pokemon2 = usePokemonDetails(teamPokemon[1]?.pokemon_id);
  const pokemon3 = usePokemonDetails(teamPokemon[2]?.pokemon_id);
  const pokemon4 = usePokemonDetails(teamPokemon[3]?.pokemon_id);
  const pokemon5 = usePokemonDetails(teamPokemon[4]?.pokemon_id);
  const pokemon6 = usePokemonDetails(teamPokemon[5]?.pokemon_id);

  const pokemonDetails = useMemo(() => {
    return [pokemon1.data, pokemon2.data, pokemon3.data, 
            pokemon4.data, pokemon5.data, pokemon6.data]
            .filter((p): p is Pokemon => !!p);
  }, [pokemon1.data, pokemon2.data, pokemon3.data, 
      pokemon4.data, pokemon5.data, pokemon6.data]);

    const analysis = useMemo(() => {
        const types = pokemonDetails.map(p => 
          p.types.map(t => t.type.name as PokemonType)
        );
        return analyzeTeamTypes(types);
      }, [pokemonDetails]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Team Type Analysis</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="font-medium mb-2">Defensive Analysis</h4>
          <div className="space-y-3">
            {analysis.weaknesses.size > 0 && (
              <div>
                <span className="text-sm text-red-600 font-medium">Weaknesses:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(analysis.weaknesses).map(([type, count]) => (
                    <span key={type} 
                      className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {type} {count > 1 ? `(${count}x)` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.resistances.size > 0 && (
              <div>
                <span className="text-sm text-green-600 font-medium">Resistances:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(analysis.resistances).map(([type, count]) => (
                    <span key={type} 
                      className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                      {type} {count > 1 ? `(${count}x)` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Offensive Coverage</h4>
          <div className="flex flex-wrap gap-1">
            {Array.from(analysis.coverage).map(([type, count]) => (
              <span key={type} 
                className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {type} {count > 1 ? `(${count}x)` : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};