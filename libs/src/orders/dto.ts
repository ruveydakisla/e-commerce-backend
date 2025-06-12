// create-order.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";

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
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems?: CreateOrderItemDto[];

  @IsOptional()
  @IsDecimal()
  totalPrice?: number;
}
