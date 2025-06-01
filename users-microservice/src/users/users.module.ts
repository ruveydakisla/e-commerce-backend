import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './common/logger';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WinstonModule.forRoot(winstonLoggerConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
