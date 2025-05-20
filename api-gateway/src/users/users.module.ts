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
        name: 'USERS_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3020, host: 'users-microservice' },
      },
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3021, host: 'auth-microservice' },
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
