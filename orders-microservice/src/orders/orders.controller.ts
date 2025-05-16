import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { ORDERS_PATTERNS } from './utils/types';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: ORDERS_PATTERNS.Create })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: ORDERS_PATTERNS.FindAll })
  findAll(@Payload() userId: number) {
    return this.ordersService.findAll(userId);
  }

  @MessagePattern({ cmd: ORDERS_PATTERNS.FindOne })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: ORDERS_PATTERNS.Update })
  update(
    @Payload()
    { updateOrderDto, id }: { updateOrderDto: UpdateOrderDto; id: number },
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @MessagePattern({ cmd: ORDERS_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.ordersService.remove(id);
  }
}
