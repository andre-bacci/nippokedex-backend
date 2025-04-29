import { Router } from 'express';
import { PokemonController } from '../controller/pokemon';

const pokemonRoutes = Router();
const controller = new PokemonController();

pokemonRoutes.get('/:query', (req, res) => controller.findPokemonByQuery(req, res));

pokemonRoutes.get('/:id/pokedex/:version', async (req, res) => controller.findPokedexIndexByVersion(req, res));

export default pokemonRoutes;
