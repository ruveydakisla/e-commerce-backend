import {
  CreateProductDTO,
  PaginationOptions,
  PRODUCTS_PATTERNS,
  SERVICES,
  UpdateProductDTO,
} from '@my/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductsService {
  constructor(
    @Inject(SERVICES.PRODUCTS.name)
    private readonly productsMicroservice: ClientProxy,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  private async clearProductCaches(specificId?: number): Promise<void> {
    const keys: string[] = await (this.cacheManager as any).store.keys(); // Type fix
    const productKeys = keys.filter((key) => key.startsWith('/products'));
    for (const key of productKeys) {
      await this.cacheManager.del(key);
    }
    if (specificId) {
      await this.cacheManager.del(`/products/${specificId}`);
    }
    console.log('API Gateway cacheleri temizlendi.');
  }
  create(createProductDto: CreateProductDTO) {
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

  async update(id: number, updateProductDto: UpdateProductDTO) {
    const result = await this.productsMicroservice
      .send({ cmd: PRODUCTS_PATTERNS.Update }, { id, updateProductDto })
      .toPromise();

    await this.clearProductCaches(id); 
    return result;
  }

  async remove(id: number) {
    const result = await this.productsMicroservice
      .send({ cmd: PRODUCTS_PATTERNS.Remove }, id)
      .toPromise();

    await this.clearProductCaches(id); 
    return result;
  }
}
