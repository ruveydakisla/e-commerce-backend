import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuhtService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ClientsModule.register([
      {
        name: SERVICES.USERS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.USERS.port, host: SERVICES.USERS.host },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AuhtService],
})
export class AppModule {}
