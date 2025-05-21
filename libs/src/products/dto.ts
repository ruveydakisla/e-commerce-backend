import { IsNotEmpty, IsOptional } from "class-validator";

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
