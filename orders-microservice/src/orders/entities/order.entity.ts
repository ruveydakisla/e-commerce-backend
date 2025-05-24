import {  Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from './BaseEntity';
@Entity('orders')
export class Order extends BaseEntity {
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  constructor(base: Partial<BaseEntity>) {
    super();
    Object.assign(this, { ...base });
  }
}
