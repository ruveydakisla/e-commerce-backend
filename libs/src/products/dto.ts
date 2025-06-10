import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsInt()
  @IsNotEmpty()
  seller_id: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

}

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsInt()
  @IsOptional()
  seller_id?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}