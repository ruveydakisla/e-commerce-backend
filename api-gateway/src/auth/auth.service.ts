import { LoginDto } from '@my/common/src/auth/dto';
import { AUTH_PATTERNS, SERVICES } from '@my/common/src/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SERVICES.AUTH.name) private authMicroservice: ClientProxy,
  ) {}
  login(loginDto: LoginDto) {
    return this.authMicroservice.send({ cmd: AUTH_PATTERNS.login }, loginDto);
  }
}
