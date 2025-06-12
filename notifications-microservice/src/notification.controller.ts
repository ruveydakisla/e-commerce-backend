import { ORDER_KAFKA_EVENTS } from '@my/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(ORDER_KAFKA_EVENTS.ORDER_CREATED)
  async orderCreatedEventHandler(@Payload() payload: any) {
    return this.notificationService.orderCreatedEventHandler(payload);
  }
}
