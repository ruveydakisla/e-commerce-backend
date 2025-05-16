import { IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  name: string;
  @IsOptional()
  description: string;
  @IsOptional()
  price: number;
  @IsOptional()
  stock: number;
  @IsOptional()
  store_id: number;
  @IsOptional()
  category_id: number;
  @IsOptional()
  rating: number;
  @IsOptional()
  sell_count: number;
}
