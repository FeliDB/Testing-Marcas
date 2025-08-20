import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // acá habilitamos CORS
  app.enableCors({
    origin: 'http://localhost:4200', // permite solo tu frontend Angular
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true
  });

  await app.listen(3001);
}
bootstrap();