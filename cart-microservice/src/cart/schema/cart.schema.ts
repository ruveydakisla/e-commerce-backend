import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type CartDocument = Cart & Document;
@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  userId: number;
  @Prop({
    type: [
      {
        productId: Number,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
  })
  items: CartItem[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);
