import { SERVICES } from '@my/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.USERS.name,
        transport: Transport.TCP,
        options: { port: SERVICES.USERS.port, host: SERVICES.USERS.host },
      },
      {
        name: SERVICES.AUTH.name,
        transport: Transport.TCP,
        options: { port: SERVICES.USERS.port, host: SERVICES.USERS.host },
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
