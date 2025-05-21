import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDERS_PATTERNS } from '@my/common/src/common/constants';
@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_MICROSERVICE') private orderMicroservice: ClientProxy,
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
