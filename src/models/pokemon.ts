import { Schema, model } from 'mongoose';

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

export const Pokemon = model<IPokemon>('Pokemon', pokemonSchema, 'pokemon');
