import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { Request, Response, CookieOptions } from 'express';
import { AuthenticationService } from './authentication.service';
import { LocalLoginDto } from './dto/local-login.dto';
import { ConfigService } from '@nestjs/config';
import { LocalRegisterDto } from './dto/local-register.dto';
import { GoogleGuard } from 'src/guards/google.guard';
import { ThirdPartyAuthDto } from './dto/third-party-auth.dto';
import { GithubGuard } from 'src/guards/github.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * HELPER: Sets a response cookie
   * @param res Response forwared from the controller
   * @param token Token provided
   */
  private setCookie(res: Response, token: string) {
    const env = this.configService.get<string>('NODE_ENV');
    const cookieOptions = {
      httpOnly: true,
      sameSite: env === 'development' ? false : 'none',
      secure: env === 'development' ? false : true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      signed: true,
    } as CookieOptions;

    res.cookie('authentication', token, cookieOptions);
  }

  // POST - api/jmp/authentication/login
  @Post('login')
  public async localLogin(
    @Body() loginData: LocalLoginDto,
    @Res() res: Response,
  ) {
    let jwt: string;
    if (loginData.email && loginData.username)
      throw new BadRequestException(
        'Local authentication must be provided with email or username, not both',
      );

    if (loginData.email) {
      const { email, password } = loginData;
      jwt = await this.authenticationService.logInWithEmail(email, password);
    }

    if (loginData.username) {
      const { username, password } = loginData;
      jwt = await this.authenticationService.logInWithUsername(
        username,
        password,
      );
    }
    this.setCookie(res, jwt);
    return res.json({ message: 'Successfully logged in' });
  }

  @Post('register')
  // POST - api/jmp/authentication/register
  public async localRegister(@Body() registerData: LocalRegisterDto) {
    try {
      const { password, doubleCheckPassword } = registerData;
      if (password !== doubleCheckPassword)
        throw new BadRequestException('Passwords do not match');
      return await this.authenticationService.registerUser(registerData);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('validate')
  // GET - api/jmp/authentication/validate
  public async validateToken(@Req() req: Request) {
    const token = req.signedCookies['authentication'];
    const data = await this.authenticationService.validate(token || '');
    if (!data.valid) throw new UnauthorizedException('Token is invalid');
    return data;
  }

  @Get('logout')
  // GET - api/jmp/authentication/logout
  public async logout(@Res() res: Response) {
    res.clearCookie('authentication');
    return res.json({ message: 'Successfully logged out' });
  }

  @Get('google')
  // GET - api/jmp/authentication/google
  @UseGuards(GoogleGuard)
  public async googleLogin() {}

  @Get('google/redirect')
  // GET - api/jmp/authentication/google/redirect
  @UseGuards(GoogleGuard)
  @Redirect(process.env.CLIENT_URL, 302)
  public async googleRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const data = new ThirdPartyAuthDto();
    data.username = user.displayName.split(' ').join('.').toLowerCase();
    data.authenticationProvider = 'google';
    data.email = user.emails[0].value;
    const token = await this.authenticationService.thirdPartyAuthenticate(data);
    this.setCookie(res, token);
  }

  @Get('github')
  // GET - api/jmp/authentication/github
  @UseGuards(GithubGuard)
  public async githubLogin() {}

  @Get('github/redirect')
  @UseGuards(GithubGuard)
  @Redirect(process.env.CLIENT_URL, 302)
  public async githubRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const data = new ThirdPartyAuthDto();
    data.username = user.username;
    data.authenticationProvider = 'github';
    data.email = user.emails[0].value;
    const token = await this.authenticationService.thirdPartyAuthenticate(data);
    this.setCookie(res, token);
  }
}
