import { SERVICES } from '@my/common/src/common/constants';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.ORDERS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.ORDERS.port, host: SERVICES.ORDERS.host },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
