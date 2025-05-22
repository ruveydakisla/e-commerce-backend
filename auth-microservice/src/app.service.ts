import { JwtPayload, LoginDto } from '@my/common';
import { SERVICES } from '@my/common';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuhtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(SERVICES.USERS.name)
    private readonly usersMicroservice: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user: any = await firstValueFrom(
        this.usersMicroservice.send({ cmd: 'Users.FindByEmail' }, { email }),
      );

      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı.');
      }

      if (password !== user.password) {
        throw new UnauthorizedException('Geçersiz şifre');
      }

      return user;
    } catch (error) {
      if (error instanceof RpcException) {
        const err = error.getError();
        let message = 'Bilinmeyen hata';

        if (typeof err === 'string') {
          message = err;
        } else if (
          typeof err === 'object' &&
          err !== null &&
          'message' in err
        ) {
          message = (err as any).message;
        }

        throw new UnauthorizedException(message);
      }

      throw new UnauthorizedException(
        'Kullanıcı doğrulama sırasında hata oluştu',
      );
    }
  }
  async login(loginDto: LoginDto) {
    const user: any = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    console.log(user);

    if (!user || loginDto.password !== user.password) {
      console.log('logindto', loginDto.password);
      console.log('user password', user.password);

      console.log('Geçersiz e-posta veya şifre');

      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
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

  async verify(token: string) {
    try {
      console.log('auth microservice verify token', token);
      const verified = await this.jwtService.verify(token);
      return verified;
    } catch (e) {
      console.log('jwt verify hatası', e);

      return { message: 'jwt verify hatası', error: e };
    }
  }
}
