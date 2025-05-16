import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './utils/types';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USERS_MICROSERVICE') private usersMicroservice: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    //db'den kullanıcıyı bul

    const user: any = this.usersMicroservice.send(
      { cmd: 'Users.FindByEmail' },
      email,
    );
    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload: JwtPayload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
