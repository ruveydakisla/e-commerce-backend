import { LoginDto } from '@my/common';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() lodinDto: LoginDto) {
    return this.authService.login(lodinDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req) {
    const sub = req.user.sub;
    console.log(req.user);

    if (!sub) {
      return { message: 'User not found' };
    }
    return this.usersService.findOne(sub);
  }
}
