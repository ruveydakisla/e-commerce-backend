import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './utils/types';

@Injectable()
export class AuhtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USERS_MICROSERVICE')
    private readonly usersMicroservice: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      console.log('validate user dayım');

      const user: any = this.usersMicroservice.send(
        { cmd: 'Users.FindByEmail' },
        { email },
      );
      if (user && password === user.password) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async login(loginDto: LoginDto) {
    console.log('auth-service service teyim');

    console.log(loginDto);

    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user || loginDto.password !== user.password) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }
    const payload: JwtPayload = {
      email: user.email,
      sub: user.sub,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
      },
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
