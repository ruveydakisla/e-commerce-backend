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
        name: 'CART_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3024, host: 'cart-microservice' },
      },

      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3021, host: 'auth-microservice' },
      },
    ]),
  ],
})
export class CartModule {}
