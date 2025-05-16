import { IsOptional } from 'class-validator';

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
