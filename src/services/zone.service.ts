import { Injectable } from '@nestjs/common';
import { ZoneController } from 'src/controllers/zone.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { zoneEntity } from '../entities/zone.entity';
import { locationEntity } from 'src/entities/location.entity';
import { Request } from '@nestjs/common'
import { Response } from '@nestjs/common';
import { last } from 'rxjs';


@Injectable()
export class ZoneService {
    constructor(
        @InjectRepository(zoneEntity)
        private zoneRepository: Repository<zoneEntity>,
        @InjectRepository(locationEntity)
        private locationRepository: Repository<locationEntity>
    ) { }

    async postZone(body: any) {
        const { name, location, radius } = body;

        // Crear y guardar la ubicación
        const newLocation = new locationEntity();
        newLocation.lat = location.lat;
        newLocation.lng = location.lng;
        const savedLocation = await this.locationRepository.save(newLocation);

        // Crear y guardar la zona
        const newZone = new zoneEntity();
        newZone.name = name;
        newZone.radius = radius;
        newZone.location = savedLocation;

        const savedZone = await this.zoneRepository.save(newZone);
        return savedZone;
}

    async getZones(){
        return this.zoneRepository.find({relations: ['location']});
    }

    async getZone(id: number){
        return this.zoneRepository.findOne({where: {idZone: id}, relations: ['location']});
    }


  async putZone(id: number, body: any) {
    const { name, location, radius } = body;

    // Buscar la zona existente
    const existingZone = await this.zoneRepository.findOne({
      where: { idZone: id },
      relations: ['location'],
    });

    if (!existingZone) {
      throw new Error(`Zone with id ${id} not found`);
    }

    // Actualizar ubicación existente o crear nueva si no hay
    if (existingZone.location) {
      existingZone.location.lat = location.lat;
      existingZone.location.lng = location.lng;
      await this.locationRepository.save(existingZone.location);
    } else {
      const newLocation = new locationEntity();
      newLocation.lat = location.lat;
      newLocation.lng = location.lng;
      const savedLocation = await this.locationRepository.save(newLocation);
      existingZone.location = savedLocation;
    }

    // Actualizar campos de zona
    existingZone.name = name;
    existingZone.radius = radius;

    const updatedZone = await this.zoneRepository.save(existingZone);
    return updatedZone;
  }

async patchZone(id: number, body: any) {
  // Buscar la zona existente
  const zone = await this.zoneRepository.findOne({
    where: { idZone: id },
    relations: ['location'],
  })

  if (!zone) {
    throw new Error(`Zone with id ${id} not found`);
  }

  // Actualizar solo los campos presentes en el body
  if (body.name !== undefined) {
    zone.name = body.name;
  }
  if (body.radius !== undefined) {
    zone.radius = body.radius;
  }

  // Guardar la zona actualizada
  const updatedZone = await this.zoneRepository.save(zone);
  return updatedZone;
}

async deleteZone(id: number) {
  // Buscar la zona existente
  const zone = await this.zoneRepository.findOne({
    where: { idZone: id },
    relations: ['location'],
  })

  if (!zone) {
    throw new Error(`Zone with id ${id} not found`);
  }

  // Eliminar la zona
  await this.zoneRepository.remove(zone);
  
  return {
    "message": "Zone deleted"
  }
}

}