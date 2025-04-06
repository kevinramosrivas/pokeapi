import { Injectable } from '@nestjs/common';
import { PokeAPIResponse } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { FetchAdapter } from 'src/common/adapters/fetch.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: FetchAdapter
  ){}
  async executeSeed(){
    await this.pokemonModel.deleteMany()
    
    let data:PokeAPIResponse = await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=600');
    let newdata:CreatePokemonDto[]  = data.results.map(
      (pokemon)=>(
        {
          no: +pokemon.url.split('/')[pokemon.url.split('/').length - 2],
          name: pokemon.name.toLowerCase()
        }
      )
    )
    await this.pokemonModel.insertMany(newdata);
    return await this.pokemonModel.find();
  }
}
