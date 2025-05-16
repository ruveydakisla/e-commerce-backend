import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationOptions, USER_PATTERNS } from './utils/types';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MICROSERVICE')
    private readonly usersMicroservice: ClientProxy,
  ) {}
  create(createUserDto: CreateUserDto) {
    console.log('api-gateway user service');

    return this.usersMicroservice.send(
      { cmd: USER_PATTERNS.Create },
      createUserDto,
    );
  }

  findAll({
    page = 1,
    sort = 'id',
    order = 'asc',
    limit = 10,
  }: PaginationOptions) {
    return this.usersMicroservice.send(
      { cmd: USER_PATTERNS.FindAll },
      { page, sort, order, limit },
    );
  }

  findOne(id: number) {
    return this.usersMicroservice.send({ cmd: USER_PATTERNS.FindOne }, { id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersMicroservice.send(
      { cmd: USER_PATTERNS.Update },
      { id, updateUserDto },
    );
  }

  remove(id: number) {
    return this.usersMicroservice.send({ cmd: USER_PATTERNS.Remove }, { id });
  }
  findByEmail(email: string) {
    return this.usersMicroservice.send(
      { cmd: USER_PATTERNS.FindByEmail },
      { email },
    );
  }
}
