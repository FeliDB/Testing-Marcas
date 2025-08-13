import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { IAbmService } from 'src/interfaces/abm.service.interface';

@Injectable()
export class MarcaService implements IAbmService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}

  async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {
    const marca = this.marcaRepository.create(createMarcaDto);
    marca.createdAt = new Date();
    return await this.marcaRepository.save(marca);
  }

  async findAll(): Promise<Marca[]> {
    return await this.marcaRepository.find();
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!marca) {
      throw new NotFoundException('Marca no encontrada');
    }
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);
  
    Object.assign(marca, updateMarcaDto);
  
    marca.updatedAt = new Date();
  
    return await this.marcaRepository.save(marca);
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const marca = await this.findOne(id);
    marca.deletedAt = new Date();
    await this.marcaRepository.save(marca);
    return { mensaje: 'Marca eliminada lógicamente' };
  }
}