import { Controller, Get } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { EventPattern } from '@nestjs/microservices';
import { ORDER_KAFKA_EVENTS, OrderCreatedEvent } from '@my/common';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

 
  @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
  orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {
    return this.shippingService.orderCreatedEventHandler(orderCreatedEvent);
  }
}
