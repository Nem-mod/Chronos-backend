import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  HttpCode,
  Body,
  Delete,
  Patch,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard } from './guards/access-jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { SendLinkDto } from '../user/email-send/dto/send-link.dto';
import { ConfigService } from '@nestjs/config';
import { CredentialsDto } from './dto/credentials.dto';
import { CreateCalendarDto } from '../calendar-system/calendar/dto/create-calendar.dto';
import { ReqUser } from './decorators/user.decorator';

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post(`register`)
  async register(
    @Body() user: CreateUserDto,
    // @Body(`calendar`) calendar: CreateCalendarDto,
  ): Promise<FullUserDto> {
    const calendar: CreateCalendarDto = {
      name: `My default calendar`,
      timezone: `Europe/Kyiv`,
    }; // TODO: remove and ask user for default calendar
    return await this.authService.register(user, calendar);
  }

  @HttpCode(204)
  @Post(`verify/send-code`)
  async sendVerify(@Body() linkInfo: SendLinkDto) {
    await this.authService.sendVerifyEmail(linkInfo);
  }

  @Patch(`verify/validate-code`)
  async validateVerify(
    @Request() req: RequestType,
    @Query(`token`) token: string,
  ) {
    await this.authService.validateVerifyEmail(token);
  }

  @Get(`verify/validate-code`)
  async validateVerifyFromGet(@Query(`token`) token: string) {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(
        `This endpoint with GET method is only for development. Use PATCH`,
      );

    await this.authService.validateVerifyEmail(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(
    @ReqUser() user: FullUserDto,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<FullUserDto> {
    const tokens = await this.authService.login(user);

    await this.authService.setAuthCookies(res, tokens);

    return user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(204)
  @Post(`logout`)
  async logout(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    await this.authService.logout(req.cookies);
    await this.authService.deleteAuthCookie(res);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(204)
  @Post(`refresh`)
  async refreshTokens(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    await this.authService.logout(req.cookies);
    const tokens: CredentialsDto = await this.authService.login(req.user);
    await this.authService.setAuthCookies(res, tokens);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(`profile`)
  async getProfile(@ReqUser() user: FullUserDto): Promise<FullUserDto> {
    return user;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(`profile`)
  async editUser(
    @ReqUser() currentUser: FullUserDto,
    @Body() user: UpdateUserDto,
  ): Promise<FullUserDto> {
    return await this.authService.editProfile(currentUser, user);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @Delete(`profile`)
  async deleteProfile(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    await this.authService.deleteProfile(req.user);
    await this.authService.deleteAuthCookie(res);
  }
}
