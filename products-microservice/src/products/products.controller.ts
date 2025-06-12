import {
  CreateProductDTO,
  OrderCreatedEvent,
  PaginationOptions,
  PRODUCTS_PATTERNS,
  UpdateProductDTO,
} from '@my/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.Create })
  create(@Payload() createProductDto: CreateProductDTO) {
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
      updateProductDto: UpdateProductDTO;
      id: number;
    },
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.Remove })
  remove(@Payload() id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: PRODUCTS_PATTERNS.DecreaseStock })
  async decreaseStock(
    @Payload() { orderCreatedEvent }: { orderCreatedEvent: OrderCreatedEvent },
  ) {
    const results: Product[] = [];

    for (const item of orderCreatedEvent.items) {
      const result = await this.productsService.decreaseStock(
        item.productId,
        item.quantity,
      );
      results.push(result);
    }

    return results;
  }
}
