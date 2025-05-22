import { AUTH_PATTERNS, LoginDto, SERVICES } from '@my/common';
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
