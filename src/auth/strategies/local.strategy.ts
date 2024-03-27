import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { FullUserDto } from '../../user/dto/full-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(login: string, password: string): Promise<FullUserDto> {
    const user: FullUserDto = await this.authService.validateUser({
      login,
      password,
    });
    if (!user.verified) throw new ForbiddenException(`User isn't verified`);
    return user;
  }
}
