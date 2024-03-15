import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { httponlyCookieOptions } from '../config/httponlyCookieOptions';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from '../user/dto/user/create-user.dto';
import { FullUserDto } from '../user/dto/user/full-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { UpdateUserDto } from '../user/dto/user/update-user.dto';
import { SendVerifyLinkDto } from './dto/send-verify-link.dto';
import { TokenDto } from './dto/token.dto';
import { CalendarService } from '../calendar-system/calendar/calendar.service';

@Injectable()
export class AuthService {
  private expiredRefreshTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly calendarService: CalendarService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: CreateUserDto[`username`],
    pass: CreateUserDto[`password`],
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
    const newUser = await this.userService.create(user);
    const newCalendarList = await this.calendarService.createCalendarList({
      _id: newUser._id,
    });

    return newUser;
  }

  async sendVerifyEmail(linkInfo: SendVerifyLinkDto): Promise<void> {
    const user = await this.userService.findByUsername(linkInfo.username);
    if (!user) throw new NotFoundException(`User not found`);
    if (user.verified) throw new ForbiddenException(`User already verified`);

    const payload: JwtPayloadDto = { username: user.username, sub: user._id };
    const verifyToken = this.jwtService.sign(
      payload,
      this.configService.get(`jwt.verify`),
    );
    linkInfo.returnUrl = linkInfo.returnUrl.replace(`verifyToken`, verifyToken);

    await this.userService.sendVerifyEmail(user, linkInfo.returnUrl);
  }

  async validateVerifyEmail(token: TokenDto[`token`]): Promise<void> {
    let payload: JwtPayloadDto;
    try {
      payload = this.jwtService.verify(
        token,
        this.configService.get(`jwt.verify`),
      );
    } catch (err) {
      throw new BadRequestException(`Token is invalid`);
    }

    try {
      await this.userService.verify(payload.sub);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  async login(user: FullUserDto): Promise<CredentialsDto> {
    const payload: JwtPayloadDto = { username: user.username, sub: user._id };

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

  async logout(tokens: CredentialsDto): Promise<void> {
    this.expiredRefreshTokens.add(tokens.refreshToken);
  }

  async setAuthCookies(
    res: ResponseType,
    tokens: CredentialsDto,
  ): Promise<void> {
    res.cookie(`accessToken`, tokens.accessToken, httponlyCookieOptions);
    res.cookie(`refreshToken`, tokens.refreshToken, httponlyCookieOptions);
  }

  async deleteAuthCookie(res: ResponseType): Promise<void> {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }

  async editProfile(
    currentUser: FullUserDto,
    user: UpdateUserDto,
  ): Promise<FullUserDto> {
    return this.userService.update(currentUser._id, user);
  }

  async removeProfile(user: FullUserDto): Promise<FullUserDto> {
    return await this.userService.remove(user._id);
  }
}
