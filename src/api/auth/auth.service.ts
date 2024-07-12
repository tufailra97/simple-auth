import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/services';
import { UserDto } from '../users/dto/dtos';
import { LoginDto } from './dto/dtos';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isValidPassword = await this.isValidPassword(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Email is not verified');
    }

    return new UserDto(user);
  }

  private async isValidPassword(password: string, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
  }
}
