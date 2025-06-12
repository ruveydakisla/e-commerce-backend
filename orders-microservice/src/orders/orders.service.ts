import {
  CreateOrderDto,
  ORDER_KAFKA_EVENTS,
  OrderCreatedEvent,
  SERVICES,
  UpdateOrderDto,
} from '@my/common';
import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(SERVICES.USERS.name)
    private readonly usersMicroservice: ClientProxy,
    @Inject(SERVICES.PRODUCTS.name)
    private readonly productMicroservice: ClientProxy,
    @Inject(SERVICES.KAFKA.name) private readonly kafka: ClientKafka,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.kafka.connect();
  }
  async create(createOrderDto: CreateOrderDto) {
    const { userId, orderItems, totalPrice } = createOrderDto;
    this.logger.info(`Creating new order for user ID: ${userId}`);

    const user = await firstValueFrom(
      this.usersMicroservice.send({ cmd: 'Users.FindOne' }, { userId }),
    );
    if (!user) {
      this.logger.warn(`User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    const order: Order = this.orderRepository.create({
      userId: user.id,
      totalPrice,
    });
    const savedOrder = await this.orderRepository.save(order);
    this.logger.info(`Order created with ID: ${savedOrder.id}`);

    for (const item of orderItems) {
      const product = await firstValueFrom(
        this.productMicroservice.send(
          { cmd: 'Products.FindOne' },
          item.productId,
        ),
      );
      if (!product) {
        this.logger.warn(`Product not found with ID: ${item.productId}`);
        throw new NotFoundException(`Product not found: ID ${item.productId}`);
      }

      const orderItem = this.orderItemRepository.create({
        order,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      });

      await this.orderItemRepository.save(orderItem);
      this.logger.info(`Order item saved for product ID: ${item.productId}`);
    }

    const event: OrderCreatedEvent = {
      orderId: savedOrder.id,
      userId: order.userId,
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: savedOrder.totalPrice,
    };

    try {
      await this.kafka.emit(ORDER_KAFKA_EVENTS.ORDER_CREATED, {
        value: JSON.stringify(event), // toString() yerine JSON.stringify daha doğru
      });
      this.logger.info(`OrderCreatedEvent sent for order ID: ${savedOrder.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send OrderCreatedEvent for order ID: ${savedOrder.id}`,
        error,
      );
    }

    return orderItems;
  }

  async findAll(userId: number) {
    try {
      this.logger.info(`Fetching all orders for user ID: ${userId}`);
      const orders = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'item')
        .where('order.userId = :userId', { userId })
        .getMany();

      this.logger.info(`Found ${orders.length} orders for user ID: ${userId}`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch orders for user ID ${userId}: ${error.message}`,
      );
      throw new Error('Orders could not be fetched');
    }
  }

  async findOne(id: number) {
    try {
      this.logger.info(`Fetching order with ID: ${id}`);
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['items'],
      });

      if (!order) {
        this.logger.warn(`Order not found with ID: ${id}`);
        throw new NotFoundException('Order not found');
      }

      this.logger.info(`Order fetched successfully with ID: ${id}`);
      return order;
    } catch (error) {
      this.logger.error(`Error fetching order ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    this.logger.info(`Updating order ID: ${id}`);
    const { userId, orderItems, totalPrice } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      this.logger.warn(`Order not found for update with ID: ${id}`);
      throw new NotFoundException('Order not found');
    }

    if (userId && userId !== order.userId) {
      const user = await firstValueFrom(
        this.usersMicroservice.send({ cmd: 'Users.FindOne' }, { userId }),
      );
      if (!user) {
        this.logger.warn(`User not found while updating order: ${userId}`);
        throw new NotFoundException('User not found');
      }
      order.userId = userId;
    }

    if (totalPrice !== undefined) {
      order.totalPrice = totalPrice;
    }

    if (orderItems && orderItems.length > 0) {
      this.logger.info(`Replacing existing items for order ID: ${id}`);
      await this.orderItemRepository.delete({ order: { id: order.id } });

      const newItems: OrderItem[] = [];

      for (const item of orderItems) {
        const product = await firstValueFrom(
          this.productMicroservice.send(
            { cmd: 'Products.FindOne' },
            item.productId,
          ),
        );
        if (!product) {
          this.logger.warn(
            `Product not found while updating: ${item.productId}`,
          );
          throw new NotFoundException(
            `Product not found: ID ${item.productId}`,
          );
        }

        const orderItem = this.orderItemRepository.create({
          order,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
        });

        newItems.push(orderItem);
      }

      await this.orderItemRepository.save(newItems);
      this.logger.info(`Order items updated for order ID: ${id}`);
    }

    const updatedOrder = await this.orderRepository.save(order);
    this.logger.info(`Order successfully updated with ID: ${updatedOrder.id}`);

    return {
      message: 'Order updated successfully',
      order: updatedOrder,
    };
  }

  async remove(id: number) {
    this.logger.info(`Deleting order with ID: ${id}`);
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      this.logger.warn(`Order not found for deletion with ID: ${id}`);
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.remove(order);
    this.logger.info(`Order deleted successfully with ID: ${id}`);
    return { message: 'Order deleted successfully' };
  }
}
