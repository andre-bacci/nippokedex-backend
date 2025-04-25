import axios, { AxiosResponse } from 'axios';
import { PokedexDetailResponse } from './response/pokedex';
import { PokemonDetailResponse } from './response/pokemon';
import { PokemonSpeciesDetailResponse } from './response/pokemonSpecies';
import { VersionDetailResponse } from './response/version';
import { VersionGroupDetailResponse } from './response/versionGroup';

export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  // create a method that read API URL using GET method
  getPokemonSpecies(query: string | number): Promise<AxiosResponse<PokemonSpeciesDetailResponse, unknown>> {
    const url = `${this.baseUrl}/pokemon-species/${query}`;

    return axios.get<PokemonSpeciesDetailResponse>(url);
  }

  getPokedex(query: string | number): Promise<AxiosResponse<PokedexDetailResponse, unknown>> {
    const url = `${this.baseUrl}/pokedex/${query}`;

    return axios.get<PokedexDetailResponse>(url);
  }

  getPokemon(query: string | number): Promise<AxiosResponse<PokemonDetailResponse, unknown>> {
    const url = `${this.baseUrl}/pokemon/${query}`;

    return axios.get<PokemonDetailResponse>(url);
  }

  getVersion(query: string | number): Promise<AxiosResponse<VersionDetailResponse, unknown>> {
    const url = `${this.baseUrl}/version/${query}`;

    return axios.get<VersionDetailResponse>(url);
  }

  getVersionGroup(query: string | number): Promise<AxiosResponse<VersionGroupDetailResponse, unknown>> {
    const url = `${this.baseUrl}/version-group/${query}`;

    return axios.get<VersionGroupDetailResponse>(url);
  }
}
