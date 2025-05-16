import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CART_PATTERNS } from './utils/types';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: CART_PATTERNS.addToCart })
  create(@Payload() createCartDto: CreateCartDto) {
    return this.cartService.addToCart(createCartDto);
  }

  @MessagePattern({ cmd: CART_PATTERNS.FindOne })
  findOne(@Payload() id: number) {
    return this.cartService.findOne(id);
  }

  @MessagePattern({ cmd: CART_PATTERNS.Update })
  update(
    @Payload()
    { updateCartDto, id }: { updateCartDto: UpdateCartDto; id: number },
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @MessagePattern({ cmd: CART_PATTERNS.Clear })
  remove(@Payload() id: number) {
    return this.cartService.clearCart(id);
  }
}
