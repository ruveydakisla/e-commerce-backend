import { AddCartDto, UpdateCartDto } from '@my/common/src/cart/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}
  async addToCart(dto: AddCartDto) {
    const cart = await this.cartModel.findOne({ userId: dto.userId });
    if (!cart) {
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
      cart.items[itemIndex].quantity += dto.quantity;
    } else {
      cart.items.push({
        productId: dto.productId,
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
      });
    }
    return cart.save();
  }

  async findOne(userId: number) {
    const cart = await this.cartModel.findOne({ userId });
    return cart;
  }

  async update(userId: number, dto: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found!');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === dto.productId,
    );

    if (itemIndex === -1) {
      throw new Error('Product id not found!');
    }

    if (dto.quantity > 0) {
      cart.items[itemIndex].quantity = dto.quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    return cart.save();
  }

  clearCart(userId: number) {
    return this.cartModel.deleteOne({ userId });
  }
  async removeItemFromCart(userId: number, productId: number) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId,
    );

    if (updatedItems.length === cart.items.length) {
      throw new Error('Product not found in cart');
    }

    cart.items = updatedItems;
    return cart.save();
  }
}
