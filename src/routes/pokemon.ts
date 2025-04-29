import { Router } from 'express';
import { Document } from 'mongoose';
import { createPokemon, IPokemon, Pokemon } from '../models/pokemon';
import { PokeApiService } from '../services/pokeApi';

const pokemonRoutes = Router();
const service = new PokeApiService();

pokemonRoutes.get('/', async (req, res) => {
  const pokemon = await Pokemon.find({}).exec();
  res.send(pokemon);
});

export const findPokemonByQuery = async (
  query: string,
): Promise<{ data: (Document & IPokemon) | null; status: number }> => {
  let pokemon: Document & IPokemon;
  if (isNaN(Number(query))) {
    pokemon = await Pokemon.findOne({ name: query }).exec();
  } else {
    pokemon = await Pokemon.findById(query).exec();
  }
  if (!pokemon) {
    try {
      const pokemonSpeciesResponse = await service.getPokemonSpecies(query);
      const pokemonResponse = await service.getPokemon(pokemonSpeciesResponse.data.id);
      pokemon = new Pokemon(createPokemon(pokemonResponse.data, pokemonSpeciesResponse.data));
      await pokemon.save();
      return {
        data: pokemon,
        status: 201,
      };
    } catch (e) {
      console.log(e);
      return {
        data: null,
        status: 400,
      };
    }
  }
  return {
    data: pokemon,
    status: 200,
  };
};

pokemonRoutes.get('/:query', async (req, res) => {
  const query = req.params.query;
  const { data, status } = await findPokemonByQuery(query);
  res.status(status).send(data);
});

pokemonRoutes.get('/:id/pokedex/:version', async (req, res) => {
  const id = req.params.id;
  const version = req.params.version;
  if (isNaN(Number(id))) {
    res.status(400).send();
  }
  try {
    const { data: pokemon } = await findPokemonByQuery(id);
    const versionResponse = await service.getVersion(version);
    const versionGroup = versionResponse.data.version_group;

    if (!versionGroup.name) {
      res.status(500).send();
      return;
    }

    const versionGroupResponse = await service.getVersionGroup(versionGroup.name);
    const pokedexes = versionGroupResponse.data.pokedexes;
    for (const pokedex of pokedexes) {
      // assumes default pokedex for version group is the first of array
      const pokedexResponse = await service.getPokedex(pokedex.name);
      const currentPokemonEntry = pokedexResponse.data.pokemon_entries.find(
        (entry) => entry.pokemon_species.name === pokemon.name,
      );
      if (currentPokemonEntry) {
        const name = pokedexResponse.data.names.find((name) => name.language.name === 'en')?.name;
        const index = currentPokemonEntry.entry_number;
        const data = { pokedex_name: name, index: index, version: version };
        res.status(200).send(data);
        return;
      }
    }
    const data = { pokedex_name: 'National', index: id, version: version };
    res.status(200).send(data);
    return;
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

export default pokemonRoutes;
