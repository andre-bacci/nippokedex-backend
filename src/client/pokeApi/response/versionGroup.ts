import { PokedexResponse } from './pokedex';
import { VersionResponse } from './version';

export interface VersionGroupResponse {
  name: string;
  url: URL;
}

export interface VersionGroupDetailResponse {
  id: number;
  name: string;
  versions: VersionResponse[];
  pokedexes: PokedexResponse[];
}
