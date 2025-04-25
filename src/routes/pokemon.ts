import { Router } from 'express';
import { Document } from 'mongoose';
import { createPokemon, Pokemon } from '../models/pokemon';
import { PokeApiService } from '../services/pokeApi';

const pokemonRoutes = Router();
const service = new PokeApiService();

pokemonRoutes.get('/', async (req, res) => {
  const pokemon = await Pokemon.find({}).exec();
  res.send(pokemon);
});

pokemonRoutes.get('/:query', async (req, res) => {
  const query = req.params.query;
  let pokemon: Document;
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
      res.status(201).send(pokemon);
      return;
    } catch (e) {
      console.log(e);
      res.status(404).send();
      return;
    }
  }
  res.send(pokemon);
});

export default pokemonRoutes;
