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
  Res,
  Patch,
  Query,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard } from './guard/access-jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
import { CreateUserDto } from '../user/dto/user/create-user.dto';
import { FullUserDto } from '../user/dto/user/full-user.dto';
import { UpdateUserDto } from '../user/dto/user/update-user.dto';
import { SendVerifyLinkDto } from './dto/send-verify-link.dto';
import { TokenDto } from './dto/token.dto';
import { ConfigService } from '@nestjs/config';
import timezones from 'timezones-list';

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
  async register(@Body() user: CreateUserDto): Promise<FullUserDto> {
    return await this.authService.register(user);
  }

  @HttpCode(204)
  @Post(`verify/send-code`)
  async sendVerify(@Body() linkInfo: SendVerifyLinkDto) {
    await this.authService.sendVerifyEmail(linkInfo);
  }

  @Patch(`verify/validate-code`)
  async verifyVerify(@Query(`token`) token: string) {
    await this.authService.validateVerifyEmail(token);
  }

  @Get(`verify/validate-code`)
  async verifyVerifyFromGet(@Query(`token`) token: string) {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(
        `This endpoint with GET method is only for development. Use PATCH`,
      );

    await this.authService.validateVerifyEmail(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ): Promise<FullUserDto> {
    console.log(timezones);
    const tokens = await this.authService.login(req.user);

    await this.authService.setAuthCookies(res, tokens);

    return req.user;
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

  @UseGuards(AccessJwtAuthGuard)
  @Get(`profile`)
  async getProfile(@Request() req: RequestType): Promise<FullUserDto> {
    return req.user;
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(`profile`)
  async editUser(
    @Request() req: RequestType,
    @Body() user: UpdateUserDto,
  ): Promise<FullUserDto> {
    return await this.authService.editProfile(req.user, user);
  }

  @UseGuards(AccessJwtAuthGuard)
  @HttpCode(204)
  @Delete(`profile`)
  async removeProfile(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    await this.authService.removeProfile(req.user);
    await this.authService.deleteAuthCookie(res);
  }
}
