import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, GoogleStrategy, GithubStrategy],
})
export class AuthenticationModule {}
