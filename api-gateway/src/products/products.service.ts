import { PRODUCTS_PATTERNS } from '@my/common/src/common/constants';
import { PaginationOptions } from '@my/common/src/common/types';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@my/common/src/products/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_MICROSERVICE')
    private readonly productsMicroservice: ClientProxy,
  ) {}
  create(createProductDto: CreateProductDto) {
    return this.productsMicroservice.send(
      { cmd: PRODUCTS_PATTERNS.Create },
      createProductDto,
    );
  }

  findAll({
    page = 1,
    sort = 'id',
    order = 'asc',
    limit = 10,
  }: PaginationOptions) {
    return this.productsMicroservice.send(
      { cmd: PRODUCTS_PATTERNS.FindAll },
      { page, limit, order, sort },
    );
  }

  findOne(id: number) {
    return this.productsMicroservice.send(
      { cmd: PRODUCTS_PATTERNS.FindOne },
      id,
    );
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productsMicroservice.send(
      { cmd: PRODUCTS_PATTERNS.Update },
      { id, updateProductDto },
    );
  }

  remove(id: number) {
    return this.productsMicroservice.send(
      { cmd: PRODUCTS_PATTERNS.Remove },
      id,
    );
  }
}
