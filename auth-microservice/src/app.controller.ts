import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { UserRole } from './utils/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'auth.login' })
  login(
    @Payload()
    data: {
      email: string;
      password: string;
      role: UserRole;
      sub: number;
    },
  ) {
    return this.appService.login(data);
  }

  @MessagePattern({ cmd: 'auth.verify' })
  verify(@Payload() token: string) {
    return this.appService.verify(token);
  }
}
