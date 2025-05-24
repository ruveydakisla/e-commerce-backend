import { OrderCreatedEvent } from '@my/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {
    console.log('orderCreatedEvent', orderCreatedEvent);
//order ile alakalı mail atılacak
    return 'Order Created';
  }
}
