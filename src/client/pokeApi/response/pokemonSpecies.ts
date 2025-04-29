import { LanguageResponse } from './language';
import { Name } from './name';
import { VersionResponse } from './version';

export interface FlavorTextEntry {
  flavor_text: string;
  language: LanguageResponse;
  version: VersionResponse;
}

export interface Genera {
  genus: string;
  language: LanguageResponse;
}

export interface PokemonSpeciesResponse {
  name: string;
  url: URL;
}

export interface PokemonSpeciesDetailResponse {
  id: number;
  flavor_text_entries: FlavorTextEntry[];
  genera: Genera[];
  name: string;
  names: Name[];
}
