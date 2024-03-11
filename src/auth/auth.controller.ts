import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  HttpCode,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard } from './guard/access-jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    const tokens = await this.authService.login(req.user);

    await this.authService.setAuthCookies(res, tokens);

    return true;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(204)
  @Post(`logout`)
  async logout(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
    await this.authService.logout(req.cookies.refreshToken);
    await this.authService.deleteAuthCookie(res);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(`profile`)
  async getProfile(@Request() req) {
    const { password, ...rest } = req.user;
    return rest;
  }
}
