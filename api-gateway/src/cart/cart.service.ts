import { AddCartDto, CART_PATTERNS, SERVICES, UpdateCartDto } from '@my/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    @Inject(SERVICES.CART.name)
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
