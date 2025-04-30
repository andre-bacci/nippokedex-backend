import { Document } from 'mongoose';
import PokeApiClient from '../client/pokeApi';
import { PokedexResponse } from '../client/pokeApi/response/pokedex';
import { PokemonDetailResponse } from '../client/pokeApi/response/pokemon';
import { PokemonSpeciesDetailResponse } from '../client/pokeApi/response/pokemonSpecies';
import { IPokemon, Pokemon } from '../models/pokemon';

export class PokemonService {
  pokeApi = new PokeApiClient();

  LANGUAGES = ['ja', 'ja-Hrkt', 'en'];
  DEFAULT_LANGUAGE = 'en';

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

  findVersionGroup = async (version: string) => {
    const versionResponse = await this.pokeApi.getVersion(version);
    const versionGroup = versionResponse.data.version_group;

    if (!versionGroup.name) {
      //throw error
    }

    return await this.pokeApi.getVersionGroup(versionGroup.name);
  };

  findPokedexNameAndIndex = async (pokemonName: string, pokedex: PokedexResponse) => {
    const pokedexResponse = await this.pokeApi.getPokedex(pokedex.name);
    const currentPokemonEntry = pokedexResponse.data.pokemon_entries.find(
      (entry) => entry.pokemon_species.name === pokemonName,
    );
    if (currentPokemonEntry) {
      const name = pokedexResponse.data.names.find((name) => name.language.name === this.DEFAULT_LANGUAGE)?.name;
      const index = currentPokemonEntry.entry_number;
      const data = { pokedex_name: name, index: index };
      return data;
    }
    return null;
  };

  findPokedexIndexByVersion = async (id: string, version: string) => {
    const pokemon = await this.findPokemonByQuery(id);
    const versionGroupResponse = await this.findVersionGroup(version);
    const pokedexes = versionGroupResponse.data.pokedexes;
    for (const pokedex of pokedexes) {
      // assumes default pokedex for version group is the first of array
      const data = this.findPokedexNameAndIndex(pokemon.name, pokedex);
      if (data) return data;
    }
    const data = { pokedex_name: 'National', index: id };
    return data;
  };
}
