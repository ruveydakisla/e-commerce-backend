import { AddCartDto, UpdateCartDto } from '@my/common/src/cart/dto';
import { CART_PATTERNS } from '@my/common/src/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_MICROSERVICE')
    private readonly cartMicroservice: ClientProxy,
  ) {}
  addToCart(createCartDto: AddCartDto) {
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
