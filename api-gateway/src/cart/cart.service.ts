import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CART_PATTERNS } from './utils/types';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_MICROSERVICE')
    private readonly cartMicroservice: ClientProxy,
  ) {}
  addToCart(createCartDto: CreateCartDto) {
    return this.cartMicroservice.send(
      { cmd: CART_PATTERNS.addToCart },
      createCartDto,
    );
  }

  findOne(id: number) {
    return this.cartMicroservice.send({ cmd: CART_PATTERNS.FindOne }, id);
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartMicroservice.send(
      { cmd: CART_PATTERNS.Update },
      { id, updateCartDto },
    );
  }

  clearCart(id: number) {
    return this.cartMicroservice.send({ cmd: CART_PATTERNS.Clear }, id);
  }
}
