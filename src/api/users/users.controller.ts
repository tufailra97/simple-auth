import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorators';
import { SuccessDto } from 'src/dtos/success.dto';
import { JwtGuard } from 'src/guards';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendVerificationEmailDto, UserDto } from './dto/dtos';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ type: SuccessDto })
  @ApiConflictResponse({ type: ConflictException })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update the current user' })
  @ApiOkResponse({ type: SuccessDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  @ApiConflictResponse({ type: ConflictException })
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: UserDto) {
    return this.usersService.updateOneById(user.id, updateUserDto);
  }

  @Get('self')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get the current user' })
  @ApiOkResponse({ type: UserDto })
  findSelf() {
    return this.usersService.findOneByEmail('');
  }

  @Post('resend-verification-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiOkResponse({ type: SuccessDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  resendVerificationEmail(
    @Body() resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    return this.usersService.resendVerificationEmail(
      resendVerificationEmailDto.email,
    );
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiOkResponse({ type: SuccessDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token);
  }
}
