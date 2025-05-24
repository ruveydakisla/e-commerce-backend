import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderKafkaProducerService } from './order-kafka-producer.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),

    ClientsModule.register([
      {
        name: SERVICES.USERS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.USERS.port, host: SERVICES.USERS.host },
      },
      {
        name: SERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.PRODUCTS.port, host: SERVICES.PRODUCTS.host },
      },
    ]),
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
  controllers: [OrdersController],
  providers: [OrdersService, OrderKafkaProducerService],
})
export class OrdersModule {}
