import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { comparePasswords } from 'src/utils/hash-password';
import { JwtPayload } from './dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { LocalRegisterDto } from './dto/local-register.dto';
import { ThirdPartyAuthDto } from './dto/third-party-auth.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a JWT token from the user information
   * @param user The user information
   * @returns A JWT token
   */
  private async generateTokenFromUserInformation(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdOn, password, authenticationProvider, ...payload } = user;
    const token = await this.jwtService.signAsync({
      ...(payload as JwtPayload),
    });
    return token;
  }

  /**
   * Performs the login operation
   * @param where To look after
   * @param password The password to validate
   * @returns Found token or null
   */
  private async makeLogIn(
    where: Prisma.UserWhereUniqueInput,
    password: string,
  ) {
    const user = (await this.userService.findUserWhere(
      where,
      false,
    )) as User | null;
    if (!user) throw new NotFoundException('User was not found');
    const hashedPassword = user.password;
    const isPassword = await comparePasswords(password, hashedPassword);
    if (!isPassword) throw new NotFoundException('User was not found');
    return this.generateTokenFromUserInformation(user) || null;
  }

  /**
   *  Logs in a user with email
   * @param email Email of the provided user
   * @param password Password sent
   * @returns JWT authentication token
   */
  public async logInWithUsername(username: string, password: string) {
    return await this.makeLogIn({ username }, password);
  }

  /**
   *  Logs in a user with username
   * @param username Username of the provided user
   * @param password Password sent
   * @returns JWT authentication token
   */
  public async logInWithEmail(email: string, password: string) {
    return await this.makeLogIn({ email }, password);
  }

  /**
   * Registers a new user
   * @param data Data to register
   * @returns registered user
   */
  public async registerUser(data: LocalRegisterDto) {
    return await this.userService.createUserLocal(data);
  }

  /**
   * Validates if the token is valid
   * @param token The token to validate
   * @returns The payload
   */
  public async authenticateSession(token: string) {
    const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;
    return payload;
  }

  /**
   *  Validates the token
   * @param token The token to validate
   * @returns  The validation result with the user information
   */
  public async validate(token: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })) as JwtPayload;
      console.log(payload);
      return {
        valid: true,
        userInformation: {
          id: payload.userId,
          email: payload.email,
          username: payload.username,
          profilePicUrl: payload.profilePicUrl,
        },
      };
    } catch {
      return { valid: false, userInformation: null };
    }
  }

  /**
   * Authenticates a user from third party services.
   * Tries to find the user in the database, if it doesn't exist, it creates it.
   * @param authData The data for authentication
   * @returns The generated token
   */
  public async thirdPartyAuthenticate(authData: ThirdPartyAuthDto) {
    const { email } = authData;
    const userExists = await this.userService.findUserWhere({ email }, true);
    if (userExists) {
      return await this.generateTokenFromUserInformation(userExists as User);
    }

    const { username } = authData;
    const newUser = await this.userService.createUserFromThirdParty({
      email,
      username,
      authenticationProvider: authData.authenticationProvider,
    });
    return await this.generateTokenFromUserInformation(newUser as User);
  }
}
