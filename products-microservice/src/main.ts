import { SERVICES } from '@my/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: SERVICES.PRODUCTS.port,
        host: '0.0.0.0',
      },
    },
  );
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log(
    `Products microservice is running on port ${SERVICES.PRODUCTS.port}`,
  );

  await app.listen();
}
bootstrap();
