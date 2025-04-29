import { Schema, model } from 'mongoose';
import { PokemonDetailResponse } from '../services/response/pokemon';
import { PokemonSpeciesDetailResponse } from '../services/response/pokemonSpecies';

export interface PokemonDetailsByLanguage {
  name: string;
  genus: string;
  descriptions: {
    version: string;
    flavor_text: string;
  }[];
}

export interface IPokemon {
  _id: number;
  name: string;
  details: {
    language: string;
    entry: PokemonDetailsByLanguage;
  }[];
  types: string[];
  sprite: URL;
  createdAt?: Date;
  updatedAt?: Date;
}

export const pokemonSchema = new Schema<IPokemon>(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    details: [
      {
        language: { type: String, required: true },
        entry: {
          type: {
            name: { type: String, required: true },
            genus: { type: String, required: true },
            descriptions: [
              {
                version: { type: String, required: true },
                flavor_text: { type: String, required: true },
              },
            ],
          },

          required: true,
        },
      },
    ],
    types: { type: [String], required: true },
    sprite: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true },
);

const LANGUAGES = ['ja', 'ja-Hrkt', 'en'];

export function createPokemon(
  pokemonResponse: PokemonDetailResponse,
  pokemonSpeciesResponse: PokemonSpeciesDetailResponse,
): IPokemon {
  return {
    _id: pokemonSpeciesResponse.id,
    name: pokemonSpeciesResponse.name,
    details: LANGUAGES.map((language) => {
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
}

export const Pokemon = model<IPokemon>('Pokemon', pokemonSchema, 'pokemon');
