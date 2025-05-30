import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    AuthModule,
     ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET')!,
            signOptions: { expiresIn: '1d' },
          }),
        }),
    ClientsModule.register([
      {
        name: SERVICES.CART.name,
        transport: Transport.TCP,
        options: { port: SERVICES.CART.port, host: SERVICES.CART.host },
      },

      {
        name: SERVICES.AUTH.name,
        transport: Transport.TCP,
        options: { port: SERVICES.AUTH.port, host: SERVICES.AUTH.host },
      },
    ]),
  ],
})
export class CartModule {}
