import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.PRODUCTS.name,
        transport: Transport.TCP,
        options: { host: SERVICES.PRODUCTS.host, port: SERVICES.PRODUCTS.port },
      },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
