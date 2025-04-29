import { Request, Response } from 'express-serve-static-core';
import { PokemonService } from '../services/pokemon';

export class PokemonController {
  service = new PokemonService();

  findPokemonByQuery = async (req: Request, res: Response) => {
    const data = await this.service.findPokemonByQuery(req.params.query);
    res.send(data);
  };

  findPokedexIndexByVersion = async (req: Request, res: Response) => {
    const data = await this.service.findPokedexIndexByVersion(req.params.id, req.params.version);
    res.send(data);
  };
}
