import {
  CreateUserDto,
  PaginationOptions,
  UpdateUserDto,
  UserRole,
} from '@my/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { OwnerOrRolesGuard } from 'src/auth/guards/owner-or-roles.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll(@Query() query: PaginationOptions) {
    return this.usersService.findAll(query);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnerOrRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SELLER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
