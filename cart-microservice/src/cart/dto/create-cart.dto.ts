import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCartDto {
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
