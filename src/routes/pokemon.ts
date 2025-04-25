import { Router } from 'express';
import { createPokemon, Pokemon } from '../models/pokemon';
import { PokeApiService } from '../services/pokeApi';

const pokemonRoutes = Router();
const service = new PokeApiService();

pokemonRoutes.get('/', async (req, res) => {
  const pokemon = await Pokemon.find({}).exec();
  res.send(pokemon);
});

pokemonRoutes.get('/:id', async (req, res) => {
  const id = req.params.id;
  let pokemon = await Pokemon.findById(req.params.id).exec();
  if (!pokemon) {
    try {
      const pokemonResponse = await service.getPokemon(id);
      const pokemonSpeciesResponse = await service.getPokemonSpecies(id);
      pokemon = new Pokemon(createPokemon(pokemonResponse.data, pokemonSpeciesResponse.data));
      pokemon.save();
      res.send(pokemon);
      return;
    } catch {
      res.status(404).send();
      return;
    }
  }
  res.send(pokemon);
});

export default pokemonRoutes;
