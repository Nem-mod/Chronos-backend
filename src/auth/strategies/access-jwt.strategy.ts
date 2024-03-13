import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Request as RequestType } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { FullUserDto } from '../../user/dto/user/full-user.dto';

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

  async validate(payload: JwtPayloadDto): Promise<FullUserDto> {
    const user = await this.userService.findById(payload.sub);

    if (!user) throw new UnauthorizedException();
    const { password, ...rest } = user;

    return rest;
  }

  private static extractJwtFromCookies(req: RequestType) {
    const accessToken = req.cookies.accessToken;

    return !accessToken ? null : accessToken;
  }
}
