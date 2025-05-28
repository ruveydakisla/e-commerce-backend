import { OrderCreatedEvent, PRODUCTS_PATTERNS, SERVICES } from '@my/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class StockService {
  constructor(@Inject(SERVICES.PRODUCTS.name) private readonly productClient: ClientProxy) {}

  orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {


      return this.productClient.send(PRODUCTS_PATTERNS.DecreaseStock,{orderCreatedEvent});
  }
}
