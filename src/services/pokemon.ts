import { Document } from 'mongoose';
import { createPokemon, IPokemon, Pokemon } from '../models/pokemon';
import { PokeApiService } from './pokeApi';

export class PokemonService {
  pokeApi = new PokeApiService();

  findPokemonByQuery = async (query: string): Promise<Document & IPokemon> => {
    let pokemon: Document & IPokemon;
    if (isNaN(Number(query))) {
      pokemon = await Pokemon.findOne({ name: query }).exec();
    } else {
      pokemon = await Pokemon.findById(query).exec();
    }
    if (!pokemon) {
      const pokemonSpeciesResponse = await this.pokeApi.getPokemonSpecies(query);
      const pokemonResponse = await this.pokeApi.getPokemon(pokemonSpeciesResponse.data.id);
      pokemon = new Pokemon(createPokemon(pokemonResponse.data, pokemonSpeciesResponse.data));
      await pokemon.save();
    }
    return pokemon;
  };

  findPokedexIndexByVersion = async (id: string, version: string) => {
    const pokemon = await this.findPokemonByQuery(id);
    const versionResponse = await this.pokeApi.getVersion(version);
    const versionGroup = versionResponse.data.version_group;

    if (!versionGroup.name) {
      //throw error
    }

    const versionGroupResponse = await this.pokeApi.getVersionGroup(versionGroup.name);
    const pokedexes = versionGroupResponse.data.pokedexes;
    for (const pokedex of pokedexes) {
      // assumes default pokedex for version group is the first of array
      const pokedexResponse = await this.pokeApi.getPokedex(pokedex.name);
      const currentPokemonEntry = pokedexResponse.data.pokemon_entries.find(
        (entry) => entry.pokemon_species.name === pokemon.name,
      );
      if (currentPokemonEntry) {
        const name = pokedexResponse.data.names.find((name) => name.language.name === 'en')?.name;
        const index = currentPokemonEntry.entry_number;
        const data = { pokedex_name: name, index: index, version: version };
        return data;
      }
    }
    const data = { pokedex_name: 'National', index: id, version: version };
    return data;
  };
}
