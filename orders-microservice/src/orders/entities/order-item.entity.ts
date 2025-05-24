import {  Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { BaseEntity } from './BaseEntity';
@Entity('order_items')
export class OrderItem extends BaseEntity {
  productId: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  constructor(dto: Partial<OrderItem>) {
    super();
    Object.assign(this, { ...dto });
  }
}
