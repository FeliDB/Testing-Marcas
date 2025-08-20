import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZoneService } from './services/zone.service';
import { DeliveryService } from './services/delivery.service';
import { ZoneController } from './controllers/zone.controller';
import { DeliveryController } from './controllers/delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'deliverydb',
      username: 'felipe',
      password: '12345',
      synchronize: true,
      entities,
      port: 5433,
      host: 'localhost',
    }),
    TypeOrmModule.forFeature(entities) // entidades por cada modulo
  ],
  
  controllers: [AppController, ZoneController, DeliveryController],
  providers: [AppService, DeliveryService, ZoneService],
})
export class AppModule { configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'delivery/*', method: RequestMethod.ALL });
  } }