import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}
  async create(createPokemonDto: CreatePokemonDto) {
    try{
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }
    catch(error){
      if(error.code === 11000) throw new BadRequestException(`Pokem exists in database ${JSON.stringify(error.keyValue)}`);
      throw new InternalServerErrorException("Can't create Pokemon - check server logs");
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon;
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    if(!pokemon && isMongoId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term});
    }

    if(!pokemon) throw new NotFoundException(`No se encontro el pokemon buscado por id, nombre o mongoid ${term}`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try{
      const pokemon = await this.findOne(term);
      await pokemon.updateOne(updatePokemonDto,{new:true});
      return pokemon;
    }
    catch(e){
      throw new BadRequestException(`No se pudo actualizar el pokemon, intentelo de nuevo por favor`);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount == 0) throw new BadRequestException(`No se pudo encontrar el pokemon con el id ${id}`)
  }
}
