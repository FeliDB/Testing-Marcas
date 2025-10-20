import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { zoneEntity } from '../src/entities/zone.entity';
import { locationEntity } from '../src/entities/location.entity';

describe('Zone E2E Tests', () => {
  let app: INestApplication;
  let zoneRepository: Repository<zoneEntity>;
  let locationRepository: Repository<locationEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    zoneRepository = moduleFixture.get<Repository<zoneEntity>>(
      getRepositoryToken(zoneEntity),
    );
    locationRepository = moduleFixture.get<Repository<locationEntity>>(
      getRepositoryToken(locationEntity),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar base de datos antes de cada test - orden importante por FK
    const zones = await zoneRepository.find();
    await zoneRepository.remove(zones);
    const locations = await locationRepository.find();
    await locationRepository.remove(locations);
  });

  describe('/zone (POST)', () => {
    it('debería crear una nueva zona', () => {
      const createZoneDto = {
        name: 'Zona Test E2E',
        location: {
          lat: -34.6037,
          lng: -58.3816
        },
        radius: 1000
      };

      return request(app.getHttpServer())
        .post('/zone')
        .send(createZoneDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('idZone');
          expect(res.body.name).toBe(createZoneDto.name);
          expect(res.body.radius).toBe(createZoneDto.radius);
          expect(res.body.location).toHaveProperty('lat', createZoneDto.location.lat);
          expect(res.body.location).toHaveProperty('lng', createZoneDto.location.lng);
        });
    });

    it('debería fallar con datos inválidos', () => {
      const invalidDto = {
        name: '',
        location: {},
        radius: -1
      };

      return request(app.getHttpServer())
        .post('/zone')
        .send(invalidDto)
        .expect(500); // Esperamos error del servidor
    });
  });

  describe('/zone (GET)', () => {
    it('debería retornar array vacío cuando no hay zonas', () => {
      return request(app.getHttpServer())
        .get('/zone')
        .expect(200)
        .expect([]);
    });

    it('debería retornar todas las zonas existentes', async () => {
      // Crear zona de prueba directamente en BD
      const location = await locationRepository.save({
        lat: -34.6037,
        lng: -58.3816
      });

      const zone = await zoneRepository.save({
        name: 'Zona E2E Test',
        radius: 500,
        location: location
      });

      return request(app.getHttpServer())
        .get('/zone')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toHaveProperty('idZone', zone.idZone);
          expect(res.body[0]).toHaveProperty('name', 'Zona E2E Test');
          expect(res.body[0]).toHaveProperty('location');
        });
    });
  });

  describe('/zone/:id (GET)', () => {
    it('debería retornar una zona específica', async () => {
      const location = await locationRepository.save({
        lat: -34.6037,
        lng: -58.3816
      });

      const zone = await zoneRepository.save({
        name: 'Zona Específica',
        radius: 750,
        location: location
      });

      return request(app.getHttpServer())
        .get(`/zone/${zone.idZone}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('idZone', zone.idZone);
          expect(res.body).toHaveProperty('name', 'Zona Específica');
          expect(res.body).toHaveProperty('radius', 750);
        });
    });

    it('debería retornar null para ID inexistente', () => {
      return request(app.getHttpServer())
        .get('/zone/999')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeNull();
        });
    });
  });

  describe('/zone/:id (PUT)', () => {
    it('debería actualizar una zona completamente', async () => {
      const location = await locationRepository.save({
        lat: -34.6037,
        lng: -58.3816
      });

      const zone = await zoneRepository.save({
        name: 'Zona Original',
        radius: 500,
        location: location
      });

      const updateDto = {
        name: 'Zona Actualizada',
        location: {
          lat: -34.7037,
          lng: -58.4816
        },
        radius: 800
      };

      return request(app.getHttpServer())
        .put(`/zone/${zone.idZone}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Zona Actualizada');
          expect(res.body.radius).toBe(800);
          expect(res.body.location.lat).toBe(-34.7037);
          expect(res.body.location.lng).toBe(-58.4816);
        });
    });
  });

  describe('/zone/:id (PATCH)', () => {
    it('debería actualizar parcialmente una zona', async () => {
      const location = await locationRepository.save({
        lat: -34.6037,
        lng: -58.3816
      });

      const zone = await zoneRepository.save({
        name: 'Zona Parcial',
        radius: 500,
        location: location
      });

      const patchDto = {
        name: 'Zona Parcialmente Actualizada'
      };

      return request(app.getHttpServer())
        .patch(`/zone/${zone.idZone}`)
        .send(patchDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Zona Parcialmente Actualizada');
          expect(res.body.radius).toBe(500); // No debería cambiar
        });
    });
  });

  describe('/zone/:id (DELETE)', () => {
    it('debería eliminar una zona exitosamente', async () => {
      const location = await locationRepository.save({
        lat: -34.6037,
        lng: -58.3816
      });

      const zone = await zoneRepository.save({
        name: 'Zona a Eliminar',
        radius: 500,
        location: location
      });

      return request(app.getHttpServer())
        .delete(`/zone/${zone.idZone}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Zone deleted');
        });
    });

    it('debería fallar al eliminar zona inexistente', () => {
      return request(app.getHttpServer())
        .delete('/zone/999')
        .expect(500);
    });
  });

  describe('Flujo completo E2E', () => {
    it('debería crear, leer, actualizar y eliminar una zona', async () => {
      // 1. Crear zona
      const createDto = {
        name: 'Zona Flujo Completo',
        location: { lat: -34.6037, lng: -58.3816 },
        radius: 600
      };

      const createResponse = await request(app.getHttpServer())
        .post('/zone')
        .send(createDto)
        .expect(201);

      const zoneId = createResponse.body.idZone;

      // 2. Leer zona creada
      await request(app.getHttpServer())
        .get(`/zone/${zoneId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Zona Flujo Completo');
        });

      // 3. Actualizar zona
      const updateDto = {
        name: 'Zona Flujo Actualizada',
        location: { lat: -34.7037, lng: -58.4816 },
        radius: 700
      };

      await request(app.getHttpServer())
        .put(`/zone/${zoneId}`)
        .send(updateDto)
        .expect(200);

      // 4. Verificar actualización
      await request(app.getHttpServer())
        .get(`/zone/${zoneId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Zona Flujo Actualizada');
          expect(res.body.radius).toBe(700);
        });

      // 5. Eliminar zona
      await request(app.getHttpServer())
        .delete(`/zone/${zoneId}`)
        .expect(200);

      // 6. Verificar eliminación
      await request(app.getHttpServer())
        .get(`/zone/${zoneId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeNull();
        });
    });
  });
});