import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuhtService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuhtService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
});
