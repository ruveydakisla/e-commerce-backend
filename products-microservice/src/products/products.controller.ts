import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { PaginationOptions, PRODUCTS_PATTERNS } from './utils/types';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.Create })
  create(@Payload() createProductDto: CreateProductDto) {
    console.log('product microserviceteyim ');
    console.log(createProductDto);

    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.FindAll })
  findAll(@Payload() paginationParams: PaginationOptions) {
    return this.productsService.findAll(paginationParams);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.FindOne })
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.Update })
  update(
    @Payload()
    {
      updateProductDto,
      id,
    }: {
      updateProductDto: UpdateProductDto;
      id: number;
    },
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.productsService.remove(id);
  }
}
