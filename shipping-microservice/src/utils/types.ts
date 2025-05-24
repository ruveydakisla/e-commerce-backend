export type ShippingStatus = 'pending' | 'shipped' | 'delivered';

export interface ShippingRecord {
  orderId: number;
  status: ShippingStatus;
  trackingNumber: string;
}
