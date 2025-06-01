import {
  CreateUserDto,
  CustomException,
  PaginatedResult,
  PaginationOptions,
  UpdateUserDto,
  UserRole,
} from '@my/common';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';
import { Logger } from 'winston';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User(createUserDto);
    const savedUser = await this.entityManager.save(User, newUser);
    this.logger.info(`User created successfully. ID: ${savedUser.id}`);
    return savedUser;
  }

  async findAll({
    limit = 5,
    order = 'asc',
    page = 0,
    sort = 'id',
  }: PaginationOptions) {
    const offset = page * limit;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    this.logger.info(
      `Fetched ${users.length} users (page: ${page}, limit: ${limit})`,
    );

    const data = users.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          name: user.name,
          email: user.email,
          birthDate: user.birthdate,
        }),
    );

    const usersResponse: PaginatedResult<UserResponseDto> = {
      data: data,
      total: await this.userRepository.count(),
      page: page,
      limit: limit,
    };
    return usersResponse;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
      });

      this.logger.info(`User found. ID: ${user.id}`);

      return new UserResponseDto({
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthdate,
        role: UserRole[user.role ?? ''],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        this.logger.warn(`User not found. ID: ${id}`);
        throw new CustomException(
          'User not found',
          HttpStatus.NOT_FOUND,
          'USER_NOT_FOUND',
          { id },
        );
      }

      this.logger.error(
        `Error occurred while fetching user. ID: ${id}, Error: ${error.message}`,
      );
      throw new RpcException({
        status: 'error',
        message: 'An unexpected error occurred while fetching user.',
      });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info(`Searching user by email: ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User not found for email: ${email}`);
      throw new RpcException({
        status: 'error',
        message: `User not found for email: ${email}`,
        statusCode: 404,
      });
    }

    this.logger.info(`User found by email: ${email}, ID: ${user.id}`);
    return user;
  }

  async update(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User not found for update. ID: ${id}`);
      throw new NotFoundException(`User not found: ${id}`);
    }

    await this.userRepository.update(id, updatedUser);
    this.logger.info(`User updated successfully. ID: ${id}`);

    const userResponse = new UserResponseDto({
      id: id,
      name: updatedUser.name,
      email: updatedUser?.email,
      birthDate: updatedUser?.birthdate,
    });
    return userResponse;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User not found for deletion. ID: ${id}`);
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      this.logger.error(`User deletion failed. ID: ${id}`);
      throw new NotFoundException(`User could not be deleted. ID: ${id}`);
    }

    this.logger.info(`User deleted successfully. ID: ${id}`);
    return { message: `User deleted successfully. ID: ${id}` };
  }
}
