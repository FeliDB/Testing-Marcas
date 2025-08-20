import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryController } from 'src/controllers/delivery.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deliveryEntity } from '../entities/delivery.entity';
import { locationEntity } from '../entities/location.entity';
import { zoneEntity } from '../entities/zone.entity';

@Injectable()
export class DeliveryService {

    constructor (
        @InjectRepository(deliveryEntity)
        private deliveryRepository: Repository<deliveryEntity>,
        @InjectRepository(locationEntity)
        private locationRepository: Repository<locationEntity>,
        @InjectRepository(zoneEntity)
        private zoneRepository: Repository<zoneEntity>
    ) {}

    async postDelivery(body: any) {
        const { personId, radius, location } = body;

        // Crear y guardar la ubicación
        const newLocation = new locationEntity();
        newLocation.lat = location.lat;
        newLocation.lng = location.lng;
        const savedLocation = await this.locationRepository.save(newLocation);

        // Crear y guardar el delivery
        const newDelivery = new deliveryEntity();
        newDelivery.personId = personId;
        newDelivery.radius = radius;
        newDelivery.location = savedLocation;
        // No se asigna zone ni status (status se asigna por defecto desde la entidad)
        // zone se deja como null automáticamente porque es opcional

        const savedDelivery = await this.deliveryRepository.save(newDelivery);

        return savedDelivery;
    }

    async putDeliveryStatus(id: number, body: any) {
        const { status } = body;

        // Buscar el delivery existente
        const delivery = await this.deliveryRepository.findOne({
            where: { idDelivery: id },
        });

        if (!delivery) {
            throw new Error(`Delivery with id ${id} not found`);
        }

        // Actualizar el status
        delivery.status = status;

        // Guardar el delivery actualizado
        const updatedDelivery = await this.deliveryRepository.save(delivery);
        return updatedDelivery;
    }

    async putDeliveryLocation(id: number, body: any) {
        const { location } = body;

        // Buscar el delivery existente
        const delivery = await this.deliveryRepository.findOne({
            where: { idDelivery: id },
            relations: ['location'],
        });

        if (!delivery) {
            throw new Error(`Delivery with id ${id} not found`);
        }

        // Actualizar la ubicación
        delivery.location.lat = location.lat;
        delivery.location.lng = location.lng;

        // Guardar el delivery actualizado
        const updatedDelivery = await this.deliveryRepository.save(delivery);
        return updatedDelivery;
    }

    async findByProximity(body: any): Promise<deliveryEntity[]> {
        const { location, radius } = body;
        const { lat, lng } = location;

        // Buscar todos los deliveries con sus ubicaciones
        const allDeliveries = await this.deliveryRepository.find({
            relations: ['location'],
        });

        // Filtrar los deliveries que cumplen la condición
        const matchingDeliveries = allDeliveries.filter((delivery) => {
            const dLat = delivery.location.lat - lat;
            const dLng = delivery.location.lng - lng;
            const distance = Math.sqrt(dLat * dLat + dLng * dLng); // Distancia en grados

            return distance <= radius && delivery.radius <= radius;
        });

        return matchingDeliveries;
    }
    

    async assignZone(id: number, body: any): Promise<deliveryEntity> {
        const { zoneIds } = body;

        // Buscar el delivery por id
        const delivery = await this.deliveryRepository.findOne({
            where: { idDelivery: id },
            relations: ['zones'], // asegúrate que este es el nombre de la relación
        });

        if (!delivery) {
            throw new Error(`Delivery with id ${id} not found`);
        }

        // Buscar zonas por id
        const zones = await this.zoneRepository.findByIds(zoneIds || []);

        // Asignar las zonas al delivery
        delivery.zones = zones;

        // Guardar y retornar
        const updatedDelivery = await this.deliveryRepository.save(delivery);
        return updatedDelivery;
    }

    async findByZone(body: any) {
        const { zoneId } = body;

        // Verificar si la zona existe (opcional pero recomendable)
        const zone = await this.zoneRepository.findOne({ where: { idZone: zoneId } });
        if (!zone) {
            throw new Error(`Zone with id ${zoneId} not found`);
        }

        // Buscar todos los deliveries con esa zona
        const deliveries = await this.deliveryRepository.find({
            where: { zones: { idZone: zoneId } }, // si es ManyToMany
            relations: ['location', 'zones'],
        });

        return deliveries;
    }

    async getZones(id: number): Promise<zoneEntity[]> {
        // Buscar el delivery con sus zonas relacionadas
        const delivery = await this.deliveryRepository.findOne({
            where: { idDelivery: id },
            relations: ['zones'], // asegurate de que este nombre coincida con tu entidad
        });

        if (!delivery) {
            throw new Error(`Delivery with id ${id} not found`);
        }

        return delivery.zones;
    }

    async deleteDeliveryZone(idDelivery: number, zoneId: number): Promise<{ message: string }> {
        await this.deliveryRepository
            .createQueryBuilder()
            .relation('zones')
            .of(idDelivery)
            .remove(zoneId);

        return {
            message: "Zone removed from delivery"
        };
    }

    async deleteDelivery(id: number): Promise<{ message: string }> {
        const delivery = await this.deliveryRepository.findOne({
            where: { idDelivery: id },
        });

        if (!delivery) {
            throw new NotFoundException(`Delivery with id ${id} not found`);
        }

        await this.deliveryRepository.remove(delivery);

        return {
            message: "Delivery deleted"
        };
    }

    async getDeliveries(){
        return this.deliveryRepository.find({
            relations: ['location', 'zones'],
        });

    }
}