import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.CART.name,
        transport: Transport.TCP,
        options: { port: SERVICES.CART.port, host: SERVICES.CART.host },
      },

      {
        name: SERVICES.AUTH.name,
        transport: Transport.TCP,
        options: { port: SERVICES.AUTH.port, host: SERVICES.AUTH.host },
      },
    ]),
  ],
})
export class CartModule {}
