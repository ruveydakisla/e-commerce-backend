import { PRODUCTS_PATTERNS } from '@my/common/src/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationOptions } from 'src/users/utils/types';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
