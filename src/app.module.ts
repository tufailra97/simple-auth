import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { PrismaModule } from './services/prima-service/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { configs } from './configs';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configs.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
