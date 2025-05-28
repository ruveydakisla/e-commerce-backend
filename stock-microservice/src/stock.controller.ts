import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';
import { EventPattern } from '@nestjs/microservices';
import { ORDER_KAFKA_EVENTS, OrderCreatedEvent } from '@my/common';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
  orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {
    return this.stockService.orderCreatedEventHandler(orderCreatedEvent);
  }
}
