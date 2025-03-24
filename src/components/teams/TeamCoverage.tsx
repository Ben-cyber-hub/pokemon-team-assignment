import { useMemo } from 'react';
import { Pokemon } from '../../types/pokemon.types';
import { TeamPokemon } from '../../types/team.types';
import { usePokemonDetails } from '../../hooks/usePokemon';
import { analyzeTeamTypes, PokemonType } from '../../utils/typeCalculations';
import { PokemonTypeTag } from '../pokemon/PokemonTypeTag';

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
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Team Type Analysis</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Defensive Score:</span>
            <span className={`px-2 py-1 rounded ${
              analysis.defensiveAnalysis.score > 0 ? 'bg-green-100 text-green-800' :
              analysis.defensiveAnalysis.score < 0 ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {analysis.defensiveAnalysis.score.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Defensive Coverage</h4>
            <div className="space-y-3">
              {analysis.defensiveAnalysis.criticalWeaknesses.length > 0 && (
                <div>
                  <span className="text-sm text-red-600 font-medium">Critical Weaknesses:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.defensiveAnalysis.criticalWeaknesses.map(type => (
                      <PokemonTypeTag key={type} type={type} size="sm" />
                    ))}
                  </div>
                </div>
              )}

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
            <h4 className="font-medium mb-2">Defensive Gaps</h4>
            <div className="space-y-2">
              {analysis.defensiveAnalysis.uncoveredTypes.length > 0 ? (
                <div>
                  <span className="text-sm text-gray-600">No resistance against:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.defensiveAnalysis.uncoveredTypes.map(type => (
                      <PokemonTypeTag key={type} type={type} size="sm" />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-green-600">
                  Good coverage! Team has resistance or immunity to all types.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {analysis.defensiveAnalysis.criticalWeaknesses.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="font-medium mb-2">Suggested Improvements</h4>
          <ul className="space-y-2 text-sm">
            {analysis.defensiveAnalysis.criticalWeaknesses.map(type => (
              <li key={type} className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Consider adding a Pokémon that resists {type} type moves
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};