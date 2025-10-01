import { Test, TestingModule } from '@nestjs/testing';
import { ZoneController } from './zone.controller';
import { ZoneService } from '../services/zone.service';

describe('ZoneController', () => {
  let zoneController: ZoneController;
  let zoneService: ZoneService;

  // Mock del service
  const mockZoneService = {
    postZone: jest.fn(),
    getZones: jest.fn(),
    getZone: jest.fn(),
    putZone: jest.fn(),
    patchZone: jest.fn(),
    deleteZone: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoneController],
      providers: [
        {
          provide: ZoneService,
          useValue: mockZoneService,
        },
      ],
    }).compile();

    zoneController = module.get<ZoneController>(ZoneController);
    zoneService = module.get<ZoneService>(ZoneService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(zoneController).toBeDefined();
  });

  describe('postZone', () => {
    it('debería crear una zona llamando al service', async () => {
      const body = { name: 'Zona 1', location: { lat: 10, lng: 20 }, radius: 50 };
      const expectedResult = { idZone: 1, ...body };

      mockZoneService.postZone.mockResolvedValue(expectedResult);

      const result = await zoneController.postZone(body);
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.postZone).toHaveBeenCalledWith(body);
    });
  });

  describe('getZones', () => {
    it('debería devolver todas las zonas', async () => {
      const expectedResult = [{ idZone: 1, name: 'Zona 1' }];
      mockZoneService.getZones.mockResolvedValue(expectedResult);

      const result = await zoneController.getZones();
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.getZones).toHaveBeenCalled();
    });
  });

  describe('getZone', () => {
    it('debería devolver una zona por id', async () => {
      const expectedResult = { idZone: 1, name: 'Zona 1' };
      mockZoneService.getZone.mockResolvedValue(expectedResult);

      const result = await zoneController.getZone(1);
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.getZone).toHaveBeenCalledWith(1);
    });
  });

  describe('putZone', () => {
    it('debería actualizar una zona', async () => {
      const body = { name: 'Zona modificada', location: { lat: 30, lng: 40 }, radius: 70 };
      const expectedResult = { idZone: 1, ...body };

      mockZoneService.putZone.mockResolvedValue(expectedResult);

      const result = await zoneController.putZone(1, body);
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.putZone).toHaveBeenCalledWith(1, body);
    });
  });

  describe('patchZone', () => {
    it('debería hacer patch a una zona', async () => {
      const body = { name: 'Parcialmente modificada' };
      const expectedResult = { idZone: 1, ...body };

      mockZoneService.patchZone.mockResolvedValue(expectedResult);

      const result = await zoneController.patchZone(1, body);
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.patchZone).toHaveBeenCalledWith(1, body);
    });
  });

  describe('deleteZone', () => {
    it('debería eliminar una zona', async () => {
      const expectedResult = { message: 'Zone deleted' };
      mockZoneService.deleteZone.mockResolvedValue(expectedResult);

      const result = await zoneController.deleteZone(1);
      expect(result).toEqual(expectedResult);
      expect(mockZoneService.deleteZone).toHaveBeenCalledWith(1);
    });
  });
});
