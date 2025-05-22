import { SERVICES } from '@my/common';
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
