import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Request as RequestType } from 'express';
import { VerifyPayloadDto } from '../dto/verify-payload.dto';
import { FullUserDto } from '../../user/dto/full-user.dto';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, `accessJwt`) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessJwtStrategy.extractJwtFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(`jwt.access.secret`),
    });
  }

  async validate(payload: VerifyPayloadDto): Promise<FullUserDto> {
    try {
      const user = await this.userService.findById(payload.sub);
      const { password, ...rest } = user;

      return rest;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private static extractJwtFromCookies(req: RequestType) {
    const accessToken = req.cookies.accessToken;

    return !accessToken ? null : accessToken;
  }
}
