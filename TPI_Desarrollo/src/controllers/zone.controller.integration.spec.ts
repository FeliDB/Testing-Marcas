import { Test, TestingModule } from '@nestjs/testing';
import { ZoneController } from './zone.controller';
import { ZoneService } from '../services/zone.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { zoneEntity } from '../entities/zone.entity';
import { locationEntity } from '../entities/location.entity';

describe('ZoneController Integration Tests (Mock & Stub)', () => {
  let controller: ZoneController;
  let service: ZoneService;
  let mockZoneRepository: any;
  let mockLocationRepository: any;

  const mockZone = {
    idZone: 1,
    name: 'Zona Centro',
    radius: 500,
    location: {
      lat: -34.6037,
      lng: -58.3816
    }
  };

  beforeEach(async () => {
    // Mock del repositorio de zonas
    mockZoneRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    // Mock del repositorio de ubicaciones
    mockLocationRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoneController],
      providers: [
        ZoneService,
        {
          provide: getRepositoryToken(zoneEntity),
          useValue: mockZoneRepository,
        },
        {
          provide: getRepositoryToken(locationEntity),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    controller = module.get<ZoneController>(ZoneController);
    service = module.get<ZoneService>(ZoneService);
  });

  describe('POST /zone', () => {
    it('debería crear una nueva zona exitosamente', async () => {
      const createZoneDto = {
        name: 'Zona Centro',
        location: { lat: -34.6037, lng: -58.3816 },
        radius: 500
      };

      const savedLocation = { lat: -34.6037, lng: -58.3816 };
      const savedZone = { ...mockZone };

      mockLocationRepository.save.mockResolvedValue(savedLocation);
      mockZoneRepository.save.mockResolvedValue(savedZone);

      const result = await controller.postZone(createZoneDto);

      expect(mockLocationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          lat: createZoneDto.location.lat,
          lng: createZoneDto.location.lng
        })
      );
      expect(mockZoneRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createZoneDto.name,
          radius: createZoneDto.radius,
          location: savedLocation
        })
      );
      expect(result).toEqual(savedZone);
    });
  });

  describe('GET /zone', () => {
    it('debería retornar todas las zonas', async () => {
      const zones = [mockZone];
      mockZoneRepository.find.mockResolvedValue(zones);

      const result = await controller.getZones();

      expect(mockZoneRepository.find).toHaveBeenCalledWith({
        relations: ['location']
      });
      expect(result).toEqual(zones);
    });
  });

  describe('GET /zone/:id', () => {
    it('debería retornar una zona específica', async () => {
      mockZoneRepository.findOne.mockResolvedValue(mockZone);

      const result = await controller.getZone(1);

      expect(mockZoneRepository.findOne).toHaveBeenCalledWith({
        where: { idZone: 1 },
        relations: ['location']
      });
      expect(result).toEqual(mockZone);
    });
  });

  describe('DELETE /zone/:id', () => {
    it('debería eliminar una zona exitosamente', async () => {
      mockZoneRepository.findOne.mockResolvedValue(mockZone);
      mockZoneRepository.remove.mockResolvedValue(mockZone);

      const result = await controller.deleteZone(1);

      expect(mockZoneRepository.findOne).toHaveBeenCalledWith({
        where: { idZone: 1 },
        relations: ['location']
      });
      expect(mockZoneRepository.remove).toHaveBeenCalledWith(mockZone);
      expect(result).toEqual({ message: 'Zone deleted' });
    });

    it('debería lanzar error si la zona no existe', async () => {
      mockZoneRepository.findOne.mockResolvedValue(null);

      await expect(controller.deleteZone(999)).rejects.toThrow('Zone with id 999 not found');
    });
  });
});