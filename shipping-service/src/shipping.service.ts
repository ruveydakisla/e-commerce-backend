import { ORDER_KAFKA_EVENTS, OrderCreatedEvent, SERVICES } from '@my/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ShippingRecord, ShippingStatus } from './utils/types';

@Injectable()
export class ShippingService implements OnModuleInit {
  constructor(
    @Inject(SERVICES.KAFKA.name) private readonly kafkaClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.kafkaClient.connect();
  }
  private shippingStore: Record<string, ShippingRecord> = {};

  async orderCreatedEventHandler(orderCreatedEvent: OrderCreatedEvent) {
    const shippingRecord: ShippingRecord = {
      orderId: orderCreatedEvent.orderId,
      status: 'pending',
      //Order tracking number generation logic
      trackingNumber: `OTN-${Math.floor(Math.random() * 1000000)}`,
    };

    this.shippingStore[orderCreatedEvent.orderId] = shippingRecord;
    await this.kafkaClient.emit(
      ORDER_KAFKA_EVENTS.ORDER_SHIPPING_CREATED,
      shippingRecord,
    );
    console.log('Shipping record created:', shippingRecord);

    return shippingRecord;
  }
  getShippingStatus(orderId: string): ShippingStatus | null {
    return this.shippingStore[orderId]?.status || null;
  }
}
