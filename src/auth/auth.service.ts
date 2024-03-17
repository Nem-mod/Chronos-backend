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
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { JwtPayloadDto } from '../user/email-send/dto/jwt-payload.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { CalendarSystemService } from '../calendar-system/calendar-system.service';
import { User } from '../user/models/user.model';
import { SendLinkDto } from '../user/email-send/dto/send-link.dto';
import { EmailSendService } from '../user/email-send/email-send.service';

@Injectable()
export class AuthService {
  private expiredRefreshTokens: Set<string> = new Set();

  constructor(
    private readonly userService: UserService,
    private readonly emailSendService: EmailSendService,
    private readonly calendarSystemService: CalendarSystemService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: CreateUserDto[`username`],
    pass: CreateUserDto[`password`],
  ): Promise<FullUserDto> {
    try {
      const user: User = await this.userService.findByUsername(username);

      if (user && (await bcrypt.compareSync(pass, user.password))) {
        const { password, ...result } = user;
        return result;
      }
    } catch (err) {}
    throw new UnauthorizedException();
  }

  async validateRefresh(tokens: CredentialsDto): Promise<CredentialsDto> {
    if (this.expiredRefreshTokens.has(tokens.refreshToken))
      throw new ForbiddenException(`Refresh token is expired`);
    return tokens;
  }

  async register(user: CreateUserDto): Promise<FullUserDto> {
    const newUser: FullUserDto = await this.userService.create(user);
    await this.calendarSystemService.initCalendarList(newUser);

    return newUser;
  }

  async sendVerifyEmail(linkInfo: SendLinkDto): Promise<void> {
    const user: User = await this.userService.findByUsername(linkInfo.username);
    if (user.verified) throw new ForbiddenException(`User already verified`);

    linkInfo = await this.emailSendService.prepareLink(
      { username: user.username, sub: user._id } as JwtPayloadDto,
      linkInfo,
      this.configService.get(`jwt.verify`),
      `verifyToken`,
    );

    await this.emailSendService.sendEmail(
      user.email,
      this.configService.get(`api.sendgrid.verify-template`),
      { link: linkInfo.returnUrl },
    );
  }

  async validateVerifyEmail(token: string): Promise<void> {
    const payload: JwtPayloadDto =
      await this.emailSendService.validateTokenFromEmail(
        token,
        this.configService.get(`jwt.verify`),
      );

    await this.userService.verify(payload.sub);
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

  async deleteProfile(user: FullUserDto): Promise<FullUserDto> {
    return await this.userService.remove(user._id);
  }
}
