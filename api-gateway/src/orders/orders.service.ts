import {
  CreateOrderDto,
  ORDERS_PATTERNS,
  SERVICES,
  UpdateOrderDto,
} from '@my/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class OrdersService {
  constructor(
    @Inject(SERVICES.ORDERS.name) private orderMicroservice: ClientProxy,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    return this.orderMicroservice.send(
      { cmd: ORDERS_PATTERNS.Create },
      createOrderDto,
    );
  }

  findAll() {
    return this.orderMicroservice.send({ cmd: ORDERS_PATTERNS.FindAll }, {});
  }

  findOne(id: number) {
    return this.orderMicroservice.send({ cmd: ORDERS_PATTERNS.FindOne }, id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderMicroservice.send(
      { cmd: ORDERS_PATTERNS.Update },
      { id, updateOrderDto },
    );
  }

  remove(id: number) {
    return this.orderMicroservice.send({ cmd: ORDERS_PATTERNS.Remove }, id);
  }
}
