import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('ORDERS_POSTGRES_HOST'),
        port: config.get<number>('ORDERS_POSTGRES_PORT'),
        username: config.get<string>('ORDERS_POSTGRES_USER'),
        password: config.get<string>('ORDERS_POSTGRES_PASSWORD'),
        database: config.get<string>('ORDERS_POSTGRES_DB'),
        synchronize: true,
        autoLoadEntities: true,
        entities: [__dirname + '/**/entities/*.entity.ts'],
        logging: true,
        cache: { duration: config.get<number>('TYPEORM_CACHE_DURATION') },
      }),
    }),
    OrdersModule,
    ClientsModule.register([
      {
        name: SERVICES.KAFKA.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'orders',
            brokers: [`${SERVICES.KAFKA.host}:${SERVICES.KAFKA.port}`],
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
