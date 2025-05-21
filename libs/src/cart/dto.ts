import { IsNotEmpty, IsOptional } from "class-validator";

export class AddCartDto {
  @IsOptional()
  userId: number;
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  quantity: number;
}
export class UpdateCartDto {
  @IsOptional()
  productId: number;
  @IsOptional()
  name: string;
  @IsOptional()
  price: number;
  @IsOptional()
  quantity: number;
}
