import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_REDIRECT_CALLBACK');
    const scope = ['user:email'];
    const opts = {
      clientID,
      clientSecret,
      callbackURL,
      scope,
    };
    super(opts);
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done,
  ) {
    done(null, profile);
  }
}
