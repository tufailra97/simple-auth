import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { PrismaModule } from './services/prima-service/prisma.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
