import { Test, TestingModule } from '@nestjs/testing';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';

describe('AppController', () => {
  let appController: ShippingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [ShippingService],
    }).compile();

    appController = app.get<ShippingController>(ShippingController);
  });

 
});
