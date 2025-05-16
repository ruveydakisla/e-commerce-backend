// create-order.dto.ts
import { IsArray, IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsDecimal()
  @IsNotEmpty()
  totalPrice: number; // totalPrice için decimal validasyonu eklendi
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsNotEmpty()
  orderItems: CreateOrderItemDto[];
  @IsNotEmpty()
  totalPrice: number; // totalPrice için decimal validasyonu eklendi
  

}
