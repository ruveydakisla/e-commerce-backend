import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions, UserRole } from 'src/utils/types';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';
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
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
      });

      return new UserResponseDto({
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthdate,
        role: UserRole[user.role ?? ''],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        // Kullanıcı bulunamadığında, NotFoundException yerine RpcException döndürelim
        throw new RpcException({
          status: 'error',
          message: `Kullanıcı bulunamadı. ID: ${id}`,
        });
      }

      // Diğer hatalar için genel bir mesaj döndür
      console.error(`Kullanıcı aranırken hata oluştu: ${error.message}`);
      throw new RpcException({
        status: 'error',
        message: 'Bir hata oluştu, lütfen tekrar deneyiniz.',
      });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`finding user by email: ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.log(`user not found ! email: ${email}`);
      
      throw new RpcException({
        status: 'error',
        message: `Kullanıcı bulunamadı. Email: ${email}`,
        statusCode: 404,
      });
    }

    return user;
  }
  async update(
    id: number,
    updatedUser: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Kullanıcı bulunamadı: ${id}`);
    }
    const result = await this.userRepository.update(id, updatedUser);

    const userResponse = new UserResponseDto({
      id: id,
      name: updatedUser.name,
      email: updatedUser?.email,
      birthDate: updatedUser?.birthdate,
    });
    return userResponse;
  }

  async remove(id: number) {
    const user = this.findOne(id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Kullanıcı bulunamadı. ID: ${id}`);
    }
    return user;
  }
}
