import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/utils/types';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(UsersService.name);
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll({
    limit = 5,
    order = 'asc',
    page = 0,
    sort = 'id',
  }: PaginationOptions) {
    console.log('users-microservice/service');

    const offset = page * limit;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
    console.log(users);
    return users.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthdate,
        }),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`finding user by email:${email}`);
    return this.userRepository.findOne({ where: { email } });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
