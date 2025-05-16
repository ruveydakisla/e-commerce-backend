import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const host = configService.get<string>('USERS_HOST');
  const port = configService.get<number>('USERS_PORT');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { transport: Transport.TCP, options: { port: port, host: host } },
  );
  await app.listen();
  console.log('Users microsevice 3020 portunda çalışıyor...');
}
bootstrap();
