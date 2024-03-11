import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Request as RequestType } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJwtFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(`jwt.refresh.secret`),
      passReqToCallback: true,
    });
  }

  async validate(req: RequestType, payload: any) {
    return await this.authService.validateRefresh(
      RefreshJwtStrategy.extractJwtFromCookies(req),
    );
  }

  private static extractJwtFromCookies(req: RequestType) {
    const refreshToken = req.cookies.refreshToken;

    return !refreshToken ? null : refreshToken;
  }
}
