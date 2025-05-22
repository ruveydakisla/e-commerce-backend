import {
  CreateUserDto,
  PaginationOptions,
  SERVICES,
  UpdateUserDto,
  USER_PATTERNS,
} from '@my/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SERVICES.USERS.name)
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
