import { AUTH_PATTERNS } from '@my/common/src/common/constants';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuhtService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AuhtService) {}

  @MessagePattern({ cmd: AUTH_PATTERNS.login })
  login(
    @Payload()
    data: {
      email: string;
      password: string;
    },
  ) {
    return this.appService.login(data);
  }
 
  @MessagePattern({ cmd: AUTH_PATTERNS.verify })
  verify(@Payload() token: string) {
    return this.appService.verify(token);
  }
}
