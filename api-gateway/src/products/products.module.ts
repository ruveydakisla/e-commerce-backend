import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: 'redis', // Docker Compose'daki Redis servisinin adı
      port: 6379,
      ttl: 3600, // Varsayılan cache ömrü saniye cinsinden (örn: 1 saat)
      max: 100, // Cache'te tutulacak maksimum öğe sayısı (isteğe bağlı)
      isGlobal: true, // CacheModule'ü global olarak kullanılabilir yapın
    }),
    ClientsModule.register([
      {
        name: SERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.PRODUCTS.port, host: SERVICES.PRODUCTS.host },
      },

      {
        name: SERVICES.AUTH.name,
        transport: Transport.TCP,
        options: { port: SERVICES.AUTH.port, host: SERVICES.AUTH.host },
      },
    ]),
  ],
})
export class ProductsModule {}
