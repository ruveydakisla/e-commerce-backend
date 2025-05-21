import { SERVICES } from '@my/common/src/common/constants';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { JwtStrategy } from './jwt/JwtStrategy';
@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ClientsModule.register([
      {
        name: SERVICES.AUTH.name,
        transport: Transport.TCP,
        options: { port: SERVICES.AUTH.port, host: SERVICES.AUTH.host },
      },
    ]),
  ],
  providers: [
    AuthService,
    AdminGuard,
    SuperAdminGuard,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, AdminGuard, SuperAdminGuard, RolesGuard, JwtAuthGuard],
})
export class AuthModule {}
