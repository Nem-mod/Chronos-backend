import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get(`profile`)
  async getProfile(@Request() req) {
    return req.user;
  }
}
