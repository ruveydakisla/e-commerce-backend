import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './common/logger';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    WinstonModule.forRoot(winstonLoggerConfig),
    ClientsModule.register([
      {
        name: SERVICES.KAFKA.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [`${SERVICES.KAFKA.host}:${SERVICES.KAFKA.port}`],
          },
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
