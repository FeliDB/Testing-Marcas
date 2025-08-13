import { CreateMarcaDto } from 'src/modules/marca/dto/create-marca.dto';
import { UpdateMarcaDto } from 'src/modules/marca/dto/update-marca.dto';
import { Marca } from 'src/modules/marca/entities/marca.entity';

export interface IAbmService {
  create(createDto: CreateMarcaDto): Promise<Marca>;
  findAll(): Promise<Marca[]>;
  findOne(id: number): Promise<Marca>;
  update(id: number, updateDto: UpdateMarcaDto): Promise<any>;
  remove(id: number): Promise<{ mensaje: string }>;
}