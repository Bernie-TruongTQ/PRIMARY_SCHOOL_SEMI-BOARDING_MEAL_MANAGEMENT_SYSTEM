import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
