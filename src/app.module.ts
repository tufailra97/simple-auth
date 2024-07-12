import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { PrismaModule } from './services/prima-service/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
