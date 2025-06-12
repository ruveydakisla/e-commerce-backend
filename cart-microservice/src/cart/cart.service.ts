import { AddCartDto, UpdateCartDto } from '@my/common';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Cart, CartDocument } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async addToCart(dto: AddCartDto) {
    this.logger.info(
      `Attempting to add product ${dto.productId} to cart for user ${dto.userId}`,
    );

    try {
      const cart = await this.cartModel.findOne({ userId: dto.userId });

      if (!cart) {
        this.logger.info(`Creating new cart for user ${dto.userId}`);
        return this.cartModel.create({
          userId: dto.userId,
          items: [
            {
              productId: dto.productId,
              name: dto.name,
              price: dto.price,
              quantity: dto.quantity,
            },
          ],
        });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId === dto.productId,
      );

      if (itemIndex > -1) {
        this.logger.info(
          `Product ${dto.productId} already exists in cart. Increasing quantity.`,
        );
        cart.items[itemIndex].quantity += dto.quantity;
      } else {
        this.logger.info(`Adding new product ${dto.productId} to cart`);
        cart.items.push({
          productId: dto.productId,
          name: dto.name,
          price: dto.price,
          quantity: dto.quantity,
        });
      }

      return await cart.save();
    } catch (error) {
      this.logger.error('Failed to add item to cart', error.stack);
      throw error;
    }
  }

  async findOne(userId: number) {
    this.logger.info(`Fetching cart for user ${userId}`);
    return this.cartModel.findOne({ userId });
  }

  async update(userId: number, dto: UpdateCartDto) {
    this.logger.info(
      `Updating cart for user ${userId}, product: ${dto.productId}`,
    );

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new Error('Cart not found!');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === dto.productId,
    );

    if (itemIndex === -1) {
      this.logger.warn(
        `Product ${dto.productId} not found in cart for user ${userId}`,
      );
      throw new Error('Product id not found!');
    }

    if (dto.quantity > 0) {
      this.logger.info(
        `Updating quantity of product ${dto.productId} to ${dto.quantity}`,
      );
      cart.items[itemIndex].quantity = dto.quantity;
    } else {
      this.logger.info(`Removing product ${dto.productId} from cart`);
      cart.items.splice(itemIndex, 1);
    }

    return cart.save();
  }

  async clearCart(userId: number) {
    this.logger.info(`Clearing cart for user ${userId}`);
    return this.cartModel.deleteOne({ userId });
  }

  async removeItemFromCart(userId: number, productId: number) {
    this.logger.info(
      `Removing product ${productId} from cart for user ${userId}`,
    );

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      this.logger.warn(`Cart not found for user ${userId}`);
      throw new Error('Cart not found');
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId,
    );

    if (updatedItems.length === cart.items.length) {
      this.logger.warn(
        `Product ${productId} not found in cart for user ${userId}`,
      );
      throw new Error('Product not found in cart');
    }

    cart.items = updatedItems;
    return cart.save();
  }
}
