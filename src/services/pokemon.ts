import { Document } from 'mongoose';
import { IPokemon, Pokemon } from '../models/pokemon';
import { PokeApiService } from './pokeApi';
import { PokemonDetailResponse } from './response/pokemon';
import { PokemonSpeciesDetailResponse } from './response/pokemonSpecies';

export class PokemonService {
  pokeApi = new PokeApiService();

  LANGUAGES = ['ja', 'ja-Hrkt', 'en'];

  createPokemon = async (
    pokemonResponse: PokemonDetailResponse,
    pokemonSpeciesResponse: PokemonSpeciesDetailResponse,
  ): Promise<Document & IPokemon> => {
    const pokemon = {
      _id: pokemonSpeciesResponse.id,
      name: pokemonSpeciesResponse.name,
      details: this.LANGUAGES.map((language) => {
        return {
          language: language,
          entry: {
            name: pokemonSpeciesResponse.names.find((name) => name.language.name === language)?.name,
            genus: pokemonSpeciesResponse.genera.find((name) => name.language.name === language)?.genus,
            descriptions: pokemonSpeciesResponse.flavor_text_entries
              .filter((name) => name.language.name === language)
              .map((entry) => {
                return { version: entry.version.name, flavor_text: entry.flavor_text };
              }),
          },
        };
      }),
      types: pokemonResponse.types.map((type) => type.type.name),
      sprite: pokemonResponse.sprites.front_default,
    };
    const instance = new Pokemon(pokemon);
    return await instance.save();
  };

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
      pokemon = await this.createPokemon(pokemonResponse.data, pokemonSpeciesResponse.data);
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
