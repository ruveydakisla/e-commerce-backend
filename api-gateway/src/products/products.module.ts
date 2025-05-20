import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3022, host: 'products-microservice' },
      },

      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3021, host: 'auth-microservice' },
      },
    ]),
  ],
})
export class ProductsModule {}
