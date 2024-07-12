import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/dtos';
import { UserDto } from '../users/dto/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);

    return user;
  }
}
