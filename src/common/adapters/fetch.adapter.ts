import { Injectable } from "@nestjs/common";
import { HttpAdapter } from "../interfaces/http-adapter.interface";


@Injectable()
export class FetchAdapter implements HttpAdapter{
    async get<T>(url: String): Promise<T> {
        try{
            let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=600');
            let data  = response.json()
            return data;
        }catch(e){
            throw new Error('Sucedios un error, revisar los logs del sistema');
        }
    }

}