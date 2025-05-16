import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // class-transformer'ı da aktifleştirir
    }),
  );
  app.useGlobalFilters(new TransformResponseInterceptor());

  console.log('API GATEWAY 3000 portunda çalışıyor...');
}
bootstrap();
