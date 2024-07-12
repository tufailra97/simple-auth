import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SuccessDto } from 'src/dtos/success.dto';
import { PrismaService } from 'src/services/prima-service/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/dtos';
import { EmailService } from 'src/services';
import { addDays, isFuture } from 'date-fns';
import { configs } from 'src/configs';
import { UpdateUserDto } from './dto/update-user.dto';

const getVerificationDate = () => addDays(new Date(), 7);

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.findOneByEmail(createUserDto.email);

    if (userExist) {
      throw new ConflictException('User already exists');
    }

    createUserDto.password = this.hashPassword(createUserDto.password);

    const { id } = await this.prismaService.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: createUserDto,
      });

      const verificationToken = await trx.userVerificationToken.create({
        data: {
          userId: user.id,
          validUntil: getVerificationDate(),
        },
      });

      return verificationToken;
    });

    await this.sendVerificationEmail(createUserDto.email, id);
    return new SuccessDto('User created successfully', 201);
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new UserDto(user);
  }

  async updateOneById(id: string, { password, email, ...rest }: UpdateUserDto) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (password) {
      user.password = this.hashPassword(password);
    }

    if (email) {
      const userTaken = await this.findOneByEmail(email);

      if (userTaken) {
        throw new ConflictException('Email already taken');
      }
    }

    await this.prismaService.user.update({
      where: { id },
      data: { ...user, ...rest },
    });

    return new UserDto(user);
  }

  async resendVerificationEmail(email: string) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      return new SuccessDto('Email already verified');
    }

    const { id } = await this.prismaService.$transaction(async (trx) => {
      await trx.userVerificationToken.deleteMany({
        where: { userId: user.id },
      });

      const newVerificationToken = await trx.userVerificationToken.create({
        data: {
          userId: user.id,
          validUntil: getVerificationDate(),
        },
      });

      return newVerificationToken;
    });

    await this.sendVerificationEmail(email, id);
    return new SuccessDto('Verification email sent successfully', 201);
  }

  async verifyEmail(token: string) {
    const verificationToken =
      await this.prismaService.userVerificationToken.findUnique({
        where: { id: token },
        include: { user: true },
      });

    if (!verificationToken) {
      throw new BadRequestException('Invalid token');
    }

    if (!isFuture(verificationToken.validUntil)) {
      throw new BadRequestException('Token expired');
    }

    await this.prismaService.user.update({
      where: { id: verificationToken.userId },
      data: { isVerified: true },
    });

    await this.prismaService.userVerificationToken.delete({
      where: { id: token },
    });

    return new SuccessDto('Email verified successfully');
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  private async sendVerificationEmail(
    email: string,
    verificationTokenId: string,
  ) {
    const verificationLink = `${configs.APP_URL}/users/verify-email?token=${verificationTokenId}`;

    await this.emailService.sendEmail(
      email,
      'Verify your email',
      `
      <h1>Verify your email</h1>

      <p>Click the link below to verify your email</p>
      <a href="${verificationLink}">Verify email</a>

      <p>Or copy and paste the link below in your browser</p>
      <p>${verificationLink}</p>

      <p>This link will expire in 7 days</p>
      <p>If you didn't create an account, you can safely ignore this email</p>

      <p>Thanks</p>    
      `,
    );
  }
}
