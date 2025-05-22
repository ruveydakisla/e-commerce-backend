import {
  CreateProductDto,
  PaginatedResult,
  PaginationOptions,
  SortOrder,
  UpdateProductDto,
} from '@my/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductResponseDTO } from './dto/product-response.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    const newProduct = new Product(createProductDto);
    const savedProduct = await this.entityManager.save(Product, newProduct);
    this.logger.log(`Ürün oluşturuldu:${savedProduct.id}`);
    return savedProduct;
  }

  async findAll(
    params: PaginationOptions,
  ): Promise<PaginatedResult<ProductResponseDTO>> {
    const { limit = 10, order = 'asc', page = 1, sort = 'id' } = params;
    console.log(params);
    console.log('products service');

    const [products, total] = await this.productRepository.findAndCount({
      relations: ['images'],
      order: { [sort]: order.toUpperCase() as SortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = products.map((product) => new ProductResponseDTO(product));
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number, userId?: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Ürün bulunamadı. ID: ${id}`);
    }
    return product;
  }

  async update(id: number, updatedProduct: UpdateProductDto) {
    const result = await this.productRepository.update(id, updatedProduct);
    if (result.affected === 0) {
      throw new NotFoundException(`Ürün bulunamadı: ${id}`);
    }

    return {
      ...updatedProduct,
      id,
    };
  }

  async remove(id: number) {
    const product = this.findOne(id);
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product Not Found. ID: ${id}`);
    }
    return product;
  }
}
