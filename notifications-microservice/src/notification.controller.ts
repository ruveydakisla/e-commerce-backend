import { ORDER_KAFKA_EVENTS, OrderCreatedEvent } from '@my/common';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
  orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {
    return this.notificationService.orderCreatedEventHandler(orderCreatedEvent);
  }
}
