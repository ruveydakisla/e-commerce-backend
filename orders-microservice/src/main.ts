import { SERVICES } from '@my/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: SERVICES.ORDERS.port,
        host: '0.0.0.0',
      },
    },
  );
  await app.listen();
}
bootstrap();
