import { Test, TestingModule } from '@nestjs/testing';
import { ZoneService } from './zone.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { zoneEntity } from '../entities/zone.entity';
import { locationEntity } from '../entities/location.entity';
import { Repository } from 'typeorm';

describe('ZoneService', () => {
  let service: ZoneService;
  let zoneRepository: Repository<zoneEntity>;
  let locationRepository: Repository<locationEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        {
          provide: getRepositoryToken(zoneEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(locationEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    zoneRepository = module.get<Repository<zoneEntity>>(getRepositoryToken(zoneEntity));
    locationRepository = module.get<Repository<locationEntity>>(getRepositoryToken(locationEntity));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('postZone', () => {
    it('debería crear una nueva zona con ubicación', async () => {
      const body = { name: 'Zona 1', radius: 100, location: { lat: 10, lng: 20 } };

      const savedLocation: locationEntity = { idLocation: 1, lat: 10, lng: 20 };
      const savedZone: zoneEntity = {
        idZone: 1,
        name: 'Zona 1',
        radius: 100,
        location: savedLocation,
        deliveries: [],
      };

      (locationRepository.save as jest.Mock).mockResolvedValue(savedLocation);
      (zoneRepository.save as jest.Mock).mockResolvedValue(savedZone);

      const result = await service.postZone(body);

      expect(locationRepository.save).toHaveBeenCalledWith(expect.objectContaining({ lat: 10, lng: 20 }));
      expect(zoneRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'Zona 1', radius: 100 }));
      expect(result).toEqual(savedZone);
    });
  });

  describe('getZones', () => {
    it('debería retornar todas las zonas con su ubicación', async () => {
      const zones: zoneEntity[] = [
        { idZone: 1, name: 'Zona 1', radius: 100, location: { idLocation: 1, lat: 10, lng: 20 }, deliveries: [] },
      ];

      (zoneRepository.find as jest.Mock).mockResolvedValue(zones);

      const result = await service.getZones();
      expect(zoneRepository.find).toHaveBeenCalledWith({ relations: ['location'] });
      expect(result).toEqual(zones);
    });
  });

  describe('getZone', () => {
    it('debería retornar una zona por id', async () => {
      const zone: zoneEntity = {
        idZone: 1,
        name: 'Zona 1',
        radius: 100,
        location: { idLocation: 1, lat: 10, lng: 20 },
        deliveries: [],
      };

      (zoneRepository.findOne as jest.Mock).mockResolvedValue(zone);

      const result = await service.getZone(1);
      expect(zoneRepository.findOne).toHaveBeenCalledWith({ where: { idZone: 1 }, relations: ['location'] });
      expect(result).toEqual(zone);
    });
  });

  describe('putZone', () => {
    it('debería actualizar una zona existente', async () => {
      const body = { name: 'Zona Actualizada', radius: 200, location: { lat: 50, lng: 60 } };

      const existingZone: zoneEntity = {
        idZone: 1,
        name: 'Vieja',
        radius: 100,
        location: { idLocation: 1, lat: 10, lng: 20 },
        deliveries: [],
      };

      (zoneRepository.findOne as jest.Mock).mockResolvedValue(existingZone);
      (locationRepository.save as jest.Mock).mockResolvedValue({ idLocation: 1, lat: 50, lng: 60 });
      (zoneRepository.save as jest.Mock).mockResolvedValue({
        ...existingZone,
        name: body.name,
        radius: body.radius,
        location: { idLocation: 1, lat: 50, lng: 60 },
      });

      const result = await service.putZone(1, body);

      expect(zoneRepository.findOne).toHaveBeenCalled();
      expect(locationRepository.save).toHaveBeenCalledWith(expect.objectContaining({ lat: 50, lng: 60 }));
      expect(result.name).toBe('Zona Actualizada');
    });

    it('debería lanzar error si la zona no existe', async () => {
      (zoneRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.putZone(99, { name: 'X', radius: 10, location: { lat: 0, lng: 0 } }))
        .rejects
        .toThrow('Zone with id 99 not found');
    });
  });

  describe('patchZone', () => {
    it('debería actualizar solo los campos enviados', async () => {
      const zone: zoneEntity = {
        idZone: 1,
        name: 'Zona 1',
        radius: 100,
        location: { idLocation: 1, lat: 10, lng: 20 },
        deliveries: [],
      };

      (zoneRepository.findOne as jest.Mock).mockResolvedValue(zone);
      (zoneRepository.save as jest.Mock).mockResolvedValue({ ...zone, name: 'Zona Nueva' });

      const result = await service.patchZone(1, { name: 'Zona Nueva' });

      expect(zoneRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: 'Zona Nueva' }));
      expect(result.name).toBe('Zona Nueva');
    });
  });

  describe('deleteZone', () => {
    it('debería eliminar una zona existente', async () => {
      const zone: zoneEntity = {
        idZone: 1,
        name: 'Zona 1',
        radius: 100,
        location: { idLocation: 1, lat: 10, lng: 20 },
        deliveries: [],
      };

      (zoneRepository.findOne as jest.Mock).mockResolvedValue(zone);
      (zoneRepository.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteZone(1);

      expect(zoneRepository.remove).toHaveBeenCalledWith(zone);
      expect(result).toEqual({ message: 'Zone deleted' });
    });

    it('debería lanzar error si la zona no existe', async () => {
      (zoneRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteZone(99)).rejects.toThrow('Zone with id 99 not found');
    });
  });
});
