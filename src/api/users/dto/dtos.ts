import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsEmail } from 'class-validator';

export class UserDto implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  isVerified: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isVerified = user.isVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class ResendVerificationEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
