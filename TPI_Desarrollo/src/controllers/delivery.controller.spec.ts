import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from '../services/delivery.service';

describe('DeliveryController', () => {
  let deliveryController: DeliveryController;
  let deliveryService: DeliveryService;

  // Mock del service
  const mockDeliveryService = {
    getDeliveries: jest.fn(),
    postDelivery: jest.fn(),
    putDeliveryLocation: jest.fn(),
    putDeliveryStatus: jest.fn(),
    findByProximity: jest.fn(),
    assignZone: jest.fn(),
    findByZone: jest.fn(),
    getZones: jest.fn(),
    deleteDeliveryZone: jest.fn(),
    deleteDelivery: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: DeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    deliveryController = module.get<DeliveryController>(DeliveryController);
    deliveryService = module.get<DeliveryService>(DeliveryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(deliveryController).toBeDefined();
  });

  describe('getDelivery', () => {
    it('debería devolver todos los deliveries', async () => {
      const expectedResult = [{ idDelivery: 1, personId: 123 }];
      mockDeliveryService.getDeliveries.mockResolvedValue(expectedResult);

      const result = await deliveryController.getDelivery();
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.getDeliveries).toHaveBeenCalled();
    });
  });

  describe('postDelivery', () => {
    it('debería crear un delivery', async () => {
      const body = { personId: 1, radius: 20, location: { lat: 10, lng: 20 } };
      const expectedResult = { idDelivery: 1, ...body };

      mockDeliveryService.postDelivery.mockResolvedValue(expectedResult);

      const result = await deliveryController.postDelivery(body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.postDelivery).toHaveBeenCalledWith(body);
    });
  });

  describe('putDeliveryLocation', () => {
    it('debería actualizar la ubicación de un delivery', async () => {
      const body = { location: { lat: 30, lng: 40 } };
      const expectedResult = { idDelivery: 1, ...body };

      mockDeliveryService.putDeliveryLocation.mockResolvedValue(expectedResult);

      const result = await deliveryController.putDeliveryLocation(1, body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.putDeliveryLocation).toHaveBeenCalledWith(1, body);
    });
  });

  describe('putDeliveryStatus', () => {
    it('debería actualizar el status de un delivery', async () => {
      const body = { status: 'DELIVERED' };
      const expectedResult = { idDelivery: 1, status: 'DELIVERED' };

      mockDeliveryService.putDeliveryStatus.mockResolvedValue(expectedResult);

      const result = await deliveryController.putDeliveryStatus(1, body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.putDeliveryStatus).toHaveBeenCalledWith(1, body);
    });
  });

  describe('findByProximity', () => {
    it('debería encontrar deliveries cercanos', async () => {
      const body = { location: { lat: 10, lng: 10 }, radius: 5 };
      const expectedResult = [{ idDelivery: 1 }];

      mockDeliveryService.findByProximity.mockResolvedValue(expectedResult);

      const result = await deliveryController.findByProximity(body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.findByProximity).toHaveBeenCalledWith(body);
    });
  });

  describe('assignZone', () => {
    it('debería asignar zonas a un delivery', async () => {
      const body = { zoneIds: [1, 2] };
      const expectedResult = { idDelivery: 1, zones: [{ idZone: 1 }, { idZone: 2 }] };

      mockDeliveryService.assignZone.mockResolvedValue(expectedResult);

      const result = await deliveryController.assignZone(1, body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.assignZone).toHaveBeenCalledWith(1, body);
    });
  });

  describe('findByZone', () => {
    it('debería encontrar deliveries por zona', async () => {
      const body = { zoneId: 1 };
      const expectedResult = [{ idDelivery: 1, zones: [{ idZone: 1 }] }];

      mockDeliveryService.findByZone.mockResolvedValue(expectedResult);

      const result = await deliveryController.findByZone(body);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.findByZone).toHaveBeenCalledWith(body);
    });
  });

  describe('getZones', () => {
    it('debería devolver las zonas de un delivery', async () => {
      const expectedResult = [{ idZone: 1 }, { idZone: 2 }];
      mockDeliveryService.getZones.mockResolvedValue(expectedResult);

      const result = await deliveryController.getZones(1);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.getZones).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteDeliveryZone', () => {
    it('debería eliminar una zona de un delivery', async () => {
      const expectedResult = { message: 'Zone removed from delivery' };
      mockDeliveryService.deleteDeliveryZone.mockResolvedValue(expectedResult);

      const result = await deliveryController.deleteDeliveryZone(1, 2);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.deleteDeliveryZone).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('deleteDelivery', () => {
    it('debería eliminar un delivery', async () => {
      const expectedResult = { message: 'Delivery deleted' };
      mockDeliveryService.deleteDelivery.mockResolvedValue(expectedResult);

      const result = await deliveryController.deleteDelivery(1);
      expect(result).toEqual(expectedResult);
      expect(mockDeliveryService.deleteDelivery).toHaveBeenCalledWith(1);
    });
  });
});
