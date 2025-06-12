import {
  CreateProductDTO,
  ORDER_KAFKA_EVENTS,
  PaginatedResult,
  PaginationOptions,
  SERVICES,
  SortOrder,
  UpdateProductDTO,
} from '@my/common';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EntityManager, Repository } from 'typeorm';
import { Logger } from 'winston';
import { ProductResponseDTO } from './dto/product-response.dto';
import { ElasticsearchSyncService } from './elasticsearch/elasticsearch-sync.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(SERVICES.KAFKA.name)
    private readonly kafkaClient: ClientKafka, // Adjust type as necessary
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject()
    private readonly elasticsearchSyncService: ElasticsearchSyncService,
  ) {}

  async create(createProductDto: CreateProductDTO) {
    try {
      console.log(createProductDto);

      const newProduct = new Product(createProductDto);
      const savedProduct = await this.entityManager.save(Product, newProduct);
      await this.productRepository.save(newProduct);
      await this.elasticsearchSyncService.indexProduct(newProduct);
      this.logger.info(`Product created: ${savedProduct.id}`);
      return savedProduct;
    } catch (error) {
      console.log("products mikroservisi ");
      
      console.log(error);
    }
  }

  async findAll(
    params: PaginationOptions,
  ): Promise<PaginatedResult<ProductResponseDTO>> {
    const { limit = 10, order = 'asc', page = 1, sort = 'id' } = params;
    const safePage = Math.max(page, 1); // page 0 veya negatifse 1 olarak ayarlanır
    this.logger.info('Fetching all products', { params });
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['images'],
      order: { [sort]: order.toUpperCase() as SortOrder },
      skip: (safePage - 1) * limit,
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
      this.logger.warn(`Product not found. ID: ${id}`);
      throw new NotFoundException(`Product not found. ID: ${id}`);
    }

    return product;
  }

  async update(id: number, updatedProduct: UpdateProductDTO) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      this.logger.warn(`Product not found for update. ID: ${id}`);
      throw new NotFoundException(`Product not found: ${id}`);
    }
    const result = await this.productRepository.update(id, updatedProduct);
    if (result.affected === 0) {
      throw new NotFoundException(`Product not found: ${id}`);
    }
    await this.productRepository.save(updatedProduct);
    await this.elasticsearchSyncService.indexProduct({
      ...product,
      ...updatedProduct,
    });
    this.logger.info(`Product updated. ID: ${id}`, { updatedProduct });
    return {
      ...updatedProduct,
      id,
    };
  }

  async remove(id: number) {
    const product = this.findOne(id);
    if (!product) {
      this.logger.warn(`Product not found for deletion. ID: ${id}`);
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.productRepository.delete(id);
      this.logger.info(`Product deleted. ID: ${id}`);
      await this.elasticsearchSyncService.removeProduct(id);

      return product;
    } catch (error) {
      this.logger.error(`Product deletion failed. ID: ${id}`, error);
      throw new NotFoundException(`Product couldn't delete. ID: ${id}`);
    }
  }

  async decreaseStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      this.logger.warn(
        `Product not found for stock decrease. ID: ${productId}`,
      );
      throw new NotFoundException(`Product not found. ID: ${productId}`);
    }

    if (typeof product.stock !== 'number') {
      this.logger.error(`Invalid stock data. Product ID: ${productId}`);
      throw new HttpException(
        `Ürün stok bilgisi geçersiz. Ürün ID: ${productId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (product.stock < quantity) {
      this.logger.warn(
        `Insufficient stock. Product ID: ${productId}, Available: ${product.stock}, Requested: ${quantity}`,
      );
      await this.kafkaClient.emit(ORDER_KAFKA_EVENTS.STOCK_WARNING, productId);
      throw new HttpException(
        `Insufficient stock. Product ID: ${productId} | Available: ${product.stock}, Requested: ${quantity}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    product.stock -= quantity;
    const updatedProduct = await this.productRepository.save(product);
    this.logger.info(
      `Stock updated. Product ID: ${productId}, New Stock: ${updatedProduct.stock}`,
    );
    return updatedProduct;
  }
}
