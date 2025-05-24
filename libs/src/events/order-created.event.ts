export class OrderCreatedEvent {
  orderId: number;
  userId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  totalPrice: number;
  toString() {
    return JSON.stringify(this);
  }
}
