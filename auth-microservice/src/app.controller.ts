import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuhtService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AuhtService) {}

  @MessagePattern({ cmd: 'auth.login' })
  login(
    @Payload()
    data: {
      email: string;
      password: string;
    },
  ) {
    console.log('auth.login->data:');
    console.log(data);

    return this.appService.login(data);
  }

  @MessagePattern({ cmd: 'auth.verify' })
  verify(@Payload() token: string) {
    return this.appService.verify(token);
  }
}
