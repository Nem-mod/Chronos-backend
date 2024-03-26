import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Request as RequestType } from 'express';
import { AuthService } from '../auth.service';
import { VerifyPayloadDto } from '../dto/verify-payload.dto';
import { FullUserDto } from '../../user/dto/full-user.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  `refreshJwt`,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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

  async validate(
    req: RequestType,
    payload: VerifyPayloadDto,
  ): Promise<FullUserDto> {
    try {
      await this.authService.validateRefresh(
        RefreshJwtStrategy.extractJwtFromCookies(req),
      );
      const user = await this.userService.findById(payload.sub);

      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private static extractJwtFromCookies(req: RequestType) {
    const refreshToken = req.cookies.refreshToken;

    return !refreshToken ? null : refreshToken;
  }
}
