import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from 'src/services';

@Module({
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
