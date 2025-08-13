import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateMarcaDto {
    @IsString({message: 'El nombre de la marca debe ser texto'})
    @MinLength(3, {message: 'El nombre de la marca debe tener al menos 3 caracteres'})
    @MaxLength(50, {message: 'El nombre de la marca debe tener menos de 50 caracteres'})
    nombre: string;
}

