import { Injectable } from '@nestjs/common';
import { PokeAPIResponse } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}
  async executeSeed(){
    await this.pokemonModel.deleteMany()
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=600',{

    })
    let data:PokeAPIResponse = await response.json();
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
