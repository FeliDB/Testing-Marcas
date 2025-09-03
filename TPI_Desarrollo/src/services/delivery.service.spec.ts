import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { deliveryEntity } from '../entities/delivery.entity';
import { locationEntity } from '../entities/location.entity';
import { zoneEntity } from '../entities/zone.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

// 📌 Mock de repositorio genérico
const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    remove: jest.fn().mockResolvedValue(undefined),
  })),
  findByIds: jest.fn(),
});

describe('DeliveryService', () => {
  let service: DeliveryService;
  let deliveryRepo: jest.Mocked<Repository<deliveryEntity>>;
  let locationRepo: jest.Mocked<Repository<locationEntity>>;
  let zoneRepo: jest.Mocked<Repository<zoneEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: getRepositoryToken(deliveryEntity), useFactory: mockRepository },
        { provide: getRepositoryToken(locationEntity), useFactory: mockRepository },
        { provide: getRepositoryToken(zoneEntity), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    deliveryRepo = module.get(getRepositoryToken(deliveryEntity));
    locationRepo = module.get(getRepositoryToken(locationEntity));
    zoneRepo = module.get(getRepositoryToken(zoneEntity));
  });

  // ✅ Caso 1 - Crear un delivery correctamente
  it('TC-001: debería crear un delivery con ubicación', async () => {
    const body = {
      personId: 1,
      radius: 10,
      location: { lat: 10, lng: 20 },
    };

    locationRepo.save.mockResolvedValue({ idLocation: 1, lat: 10, lng: 20 } as locationEntity);
    deliveryRepo.save.mockResolvedValue({ idDelivery: 1, ...body } as deliveryEntity);

    const result = await service.postDelivery(body);

    expect(locationRepo.save).toHaveBeenCalled();
    expect(deliveryRepo.save).toHaveBeenCalled();
    expect(result.idDelivery).toBe(1);
  });

  // ✅ Caso 2 - Actualizar el status de un delivery
  it('TC-002: debería actualizar el status de un delivery', async () => {
    const delivery = { idDelivery: 1, status: 'avaliable' } as deliveryEntity;
    deliveryRepo.findOne.mockResolvedValue(delivery);
    deliveryRepo.save.mockResolvedValue({ ...delivery, status: 'busy' });

    const result = await service.putDeliveryStatus(1, { status: 'busy' });

    expect(result.status).toBe('busy');
  });

  // ❌ Caso 3 - Error al actualizar status de delivery inexistente
  it('TC-003: debería lanzar error si el delivery no existe al actualizar status', async () => {
    deliveryRepo.findOne.mockResolvedValue(null);

    await expect(service.putDeliveryStatus(99, { status: 'busy' }))
      .rejects
      .toThrow('Delivery with id 99 not found');
  });

  // ✅ Caso 4 - Buscar por proximidad
  it('TC-004: debería devolver deliveries cercanos', async () => {
    const delivery = {
      idDelivery: 1,
      radius: 10,
      location: { lat: 10, lng: 20 },
    } as deliveryEntity;

    deliveryRepo.find.mockResolvedValue([delivery]);

    const result = await service.findByProximity({
      location: { lat: 11, lng: 20 },
      radius: 5,
    });

    expect(result.length).toBe(1);
  });

  // ✅ Caso 5 - Eliminar un delivery existente
  it('TC-005: debería eliminar un delivery existente', async () => {
    const delivery = { idDelivery: 1 } as deliveryEntity;
    deliveryRepo.findOne.mockResolvedValue(delivery);
    deliveryRepo.remove.mockResolvedValue(delivery);

    const result = await service.deleteDelivery(1);

    expect(result).toEqual({ message: 'Delivery deleted' });
  });

  // ❌ Caso 6 - Error al eliminar un delivery inexistente
  it('TC-006: debería lanzar NotFoundException al eliminar delivery inexistente', async () => {
    deliveryRepo.findOne.mockResolvedValue(null);

    await expect(service.deleteDelivery(99))
      .rejects
      .toThrow(NotFoundException);
  });
});
