import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { hoursToMilliseconds } from 'date-fns';
import { Response } from 'express';
import { configs } from 'src/configs';
import { UserDto } from '../users/dto/dtos';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);
    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      domain: configs.DOMAIN,
      maxAge: hoursToMilliseconds(2),
    });

    return user;
  }
}
