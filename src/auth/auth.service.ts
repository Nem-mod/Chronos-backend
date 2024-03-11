import { ForbiddenException, Injectable } from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { httponlyCookieOptions } from '../config/httponlyCookieOptions';

@Injectable()
export class AuthService {
  private expiredRefreshTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOne(username);

    if (user && (await bcrypt.compareSync(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateRefresh(refreshToken: string) {
    if (this.expiredRefreshTokens.has(refreshToken))
      throw new ForbiddenException(`Refresh token is expired`);
    return refreshToken;
  }

  async login(user: any) {
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

  async setAuthCookies(
    res: ResponseType,
    tokens: { accessToken; refreshToken },
  ) {
    res.cookie(`accessToken`, tokens.accessToken, httponlyCookieOptions);
    res.cookie(`refreshToken`, tokens.refreshToken, httponlyCookieOptions);
  }

  async deleteAuthCookie(res) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }
}
