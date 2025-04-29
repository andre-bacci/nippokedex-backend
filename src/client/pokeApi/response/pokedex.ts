import { Name } from './name';
import { PokemonSpeciesResponse } from './pokemonSpecies';

export interface PokedexResponse {
  name: string;
  url: URL;
}

export interface PokedexEntry {
  entry_number: number;
  pokemon_species: PokemonSpeciesResponse;
}

export interface PokedexDetailResponse {
  id: number;
  name: string;
  names: Name[];
  pokemon_entries: PokedexEntry[];
}
