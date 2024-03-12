import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  HttpCode,
  Body,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard } from './guard/access-jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FullUserDto } from '../user/dto/full-user.dto';

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  async register(@Body() user: CreateUserDto): Promise<FullUserDto> {
    return await this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(
    @Request() req: RequestType,
    @Response({ passthrough: true }) res: ResponseType,
  ) {
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
    await this.authService.logout(req.cookies.refreshToken);
    await this.authService.deleteAuthCookie(res);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get(`profile`)
  async getProfile(@Request() req: RequestType) {
    return req.user;
  }
}
