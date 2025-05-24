import { SERVICES } from '@my/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './shipping.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'orders',
          brokers: [`${SERVICES.KAFKA.host}:${SERVICES.KAFKA.port}`],
        },
        consumer: {
          groupId: 'shipping-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
