import { SERVICES } from '@my/common';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from 'src/auth/auth.module';
import { ProductSearchController } from './products-search.controller';
import { ProductSearchService } from './products-search.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController, ProductSearchController],
  providers: [ProductsService, ProductSearchService],
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
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
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
