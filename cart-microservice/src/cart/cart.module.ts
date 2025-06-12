import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { winstonLoggerConfig } from './common/logger';
import { Cart, CartSchema } from './schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    WinstonModule.forRoot(winstonLoggerConfig),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
