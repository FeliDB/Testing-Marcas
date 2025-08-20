import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3001);

  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
  // const corsOptions: CorsOptions = {
  //   origin: '*', // Permitir solicitudes desde cualquier origen
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // };

bootstrap();
