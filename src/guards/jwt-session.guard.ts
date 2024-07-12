import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserDto } from 'src/api/users/dto/dtos';

import { configs } from 'src/configs';
import { PrismaService } from 'src/services';
import { JwtToken } from 'src/types';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      this.throwUnauthorized();
    }

    const payload = await this.verifyToken(token);
    const user = await this.prismaService.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      this.throwUnauthorized();
    }

    // set token to request.user so that it can be accessed in the controller
    request.user = new UserDto(user);

    return true;
  }

  private async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtToken>(token, {
        secret: configs.JWT_SECRET,
      });
    } catch (error) {
      this.throwUnauthorized();
    }
  }

  private getToken(request: Request): string | undefined {
    const authorizationHeader = request.cookies['access_token'];

    return authorizationHeader;
  }

  private throwUnauthorized(): never {
    throw new UnauthorizedException('Unauthorized');
  }
}
