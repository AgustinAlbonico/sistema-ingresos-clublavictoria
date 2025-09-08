import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AppConfigService } from './config/AppConfig/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);
  app.setGlobalPrefix('api');
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en DTO
      forbidNonWhitelisted: true, // lanza error si mandan campos extras
      transform: true, // convierte automáticamente a clases/objetos
      transformOptions: {
        enableImplicitConversion: true, // permite parsear tipos básicos (string -> number)
      },
    }),
  );

  // registro global del filtro
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  await app.listen(config.getPort() ?? 3001);
}
bootstrap();
