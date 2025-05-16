import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsOptional()
  stock: number;
  @IsNotEmpty()
  store_id: number;
  @IsNotEmpty()
  category_id: number;
  @IsOptional()
  rating: number;
  @IsNotEmpty()
  sell_count: number;

} 
