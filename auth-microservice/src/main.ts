import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port: 3021, host: '0.0.0.0' },
    },
  );
  await app.listen();
  console.log('Auth microservice runnning on 3021...');
}
bootstrap();
