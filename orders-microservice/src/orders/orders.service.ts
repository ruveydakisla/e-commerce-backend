import { CreateOrderDto, SERVICES, UpdateOrderDto } from '@my/common';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(SERVICES.USERS.name)
    private readonly usersMicroservice: ClientProxy,
    @Inject(SERVICES.PRODUCTS.name)
    private readonly productMicroservice: ClientProxy,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const { userId, orderItems, totalPrice } = createOrderDto;
    const user = this.usersMicroservice.send(
      { cmd: 'Users.FindOne' },
      { userId },
    );
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const order: Order = this.orderRepository.create({
      ...user,
      totalPrice,
    });
    await this.orderRepository.save(order);

    for (const item of orderItems) {
      const product = this.productMicroservice.send(
        {
          cmd: 'Products.FindOne',
        },
        item.productId,
      );
      if (!product) {
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
    }

    // Siparişi geri döndürüyoruz
    return orderItems;
  }

  async findAll(userId: number) {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.items', 'items')
        .where('orders.userId = :userId', { userId })
        .getMany();

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Orders could not be fetched');
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return ``;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }
}
