import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { AUTH_PATTERNS } from './utils/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private authMicroservice: ClientProxy,
  ) {}
  login(loginDto: LoginDto) {
    return this.authMicroservice.send({ cmd: AUTH_PATTERNS.login }, loginDto);
  }
}
