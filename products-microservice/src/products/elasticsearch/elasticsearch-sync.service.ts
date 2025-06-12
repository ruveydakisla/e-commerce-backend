import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from '../entities/product.entity';

@Injectable()
export class ElasticsearchSyncService implements OnModuleInit {
  constructor(private readonly esService: ElasticsearchService) {}
  async onModuleInit() {
    const indexExists = await this.esService.indices.exists({
      index: 'products',
    });
    if (!indexExists) {
      await this.esService.indices.create({
        index: 'products',
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'float' },
            stock: { type: 'integer' },
            category: { type: 'keyword' },
          },
        },
      });
    }
  }

  async indexProduct(product: Product) {
    await this.esService.index({
      index: 'products',
      id: product.id.toString(),
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      },
    });
  }
  async removeProduct(productId: number) {
    await this.esService.delete({
      index: 'products',
      id: productId.toString(),
    });
  }
}
