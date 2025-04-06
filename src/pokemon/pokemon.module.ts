import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonShema } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports:[
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonShema

      }
    ])
  ],
  exports:[
    MongooseModule
  ]
})
export class PokemonModule {}
