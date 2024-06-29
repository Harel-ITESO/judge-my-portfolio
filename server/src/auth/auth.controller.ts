import { Controller, Get, Req, Headers, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { GithubGuard } from './guards/github.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly redirectAppUrl =
    this.configService.get<string>('CLIENT_URL') + '/login/successful';

  constructor(
    private readonly accountService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  public async googleRedirect(@Req() req, @Res() res) {
    try {
      const data = {
        email: req.user.emails[0].value,
        username: req.user.displayName,
        imageUrl: req.user.photos[0].value,
      };
      const token = await this.accountService.registerOrAccessAccount({
        serviceProvider: 'google',
        ...data,
      });
      const redirectUrl = this.redirectAppUrl + '?token=' + token;
      return res.redirect(redirectUrl);
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  @Get('github')
  @UseGuards(GithubGuard)
  public async ghAuth() {}

  @Get('github/redirect')
  @UseGuards(GithubGuard)
  public async ghRedirect(@Req() req, @Res() res) {
    try {
      const data = {
        email: req.user.emails[0].value,
        username: req.user.username,
        imageUrl: req.user.photos[0].value,
      };
      const token = await this.accountService.registerOrAccessAccount({
        serviceProvider: 'github',
        ...data,
      });
      const redirectUrl = this.redirectAppUrl + '?token=' + token;
      return res.redirect(redirectUrl);
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  @Get('validate-token')
  public async validateToken(@Headers('token') token: string) {
    try {
      const data = await this.accountService.validateTokenSignature(token);
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}
