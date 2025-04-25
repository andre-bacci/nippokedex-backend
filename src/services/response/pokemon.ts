import { TypeResponse } from './type';

export interface Sprite {
  front_default: URL;
}

export interface PokemonType {
  slot: number;
  type: TypeResponse;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: Sprite;
  types: PokemonType[];
}
