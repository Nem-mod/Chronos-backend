import { ForbiddenException, Injectable } from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { httponlyCookieOptions } from '../config/httponlyCookieOptions';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';

@Injectable()
export class AuthService {
  private expiredRefreshTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<FullUserDto | null> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compareSync(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateRefresh(tokens: CredentialsDto): Promise<CredentialsDto> {
    if (this.expiredRefreshTokens.has(tokens.refreshToken))
      throw new ForbiddenException(`Refresh token is expired`);
    return tokens;
  }

  async register(user: CreateUserDto): Promise<FullUserDto> {
    return await this.userService.create(user);
  }

  async login(user: any): Promise<CredentialsDto> {
    const payload = { username: user.username, sub: user.userId };

    const accessToken = this.jwtService.sign(
      payload,
      this.configService.get(`jwt.access`),
    );
    const refreshToken = this.jwtService.sign(
      payload,
      this.configService.get(`jwt.refresh`),
    );

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    this.expiredRefreshTokens.add(refreshToken);
  }

  async setAuthCookies(res: ResponseType, tokens: CredentialsDto) {
    res.cookie(`accessToken`, tokens.accessToken, httponlyCookieOptions);
    res.cookie(`refreshToken`, tokens.refreshToken, httponlyCookieOptions);
  }

  async deleteAuthCookie(res) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }
}
