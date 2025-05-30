import { SERVICES } from '@my/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'orders',
          brokers: [`${SERVICES.KAFKA.host}:${SERVICES.KAFKA.port}`],
        },
        consumer: {
          groupId: 'notification-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
