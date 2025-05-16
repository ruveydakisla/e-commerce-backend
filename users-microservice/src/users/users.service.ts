import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions, UserRole } from 'src/utils/types';
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
  async create(CreateUserDto: CreateUserDto) {
    const newUser = new User(CreateUserDto);
    const savedUser = await this.entityManager.save(User, newUser);
    this.logger.log(`kullanıcı oluşturuldu:${savedUser.id}`);
    return savedUser;
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

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    const userResponse = new UserResponseDto({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      birthDate: user?.birthdate,
      role: UserRole[user?.role ?? ''],
    });

    if (!user) {
      throw new NotFoundException(`Kullanıcı bulunamadı. ID: ${id}`);
    }
    return userResponse;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`finding user by email:${email}`);
    return this.userRepository.findOne({ where: { email } });
  }

  async update(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.userRepository.update(id, updatedUser);
    if (result.affected === 0) {
      throw new NotFoundException(`Kullanıcı bulunamadı: ${id}`);
    }
    const userResponse = new UserResponseDto({
      id: id,
      name: updatedUser.name,
      email: updatedUser?.email,
      birthDate: updatedUser?.birthdate,
    });
    return userResponse;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
