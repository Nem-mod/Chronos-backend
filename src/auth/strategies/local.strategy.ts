import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { FullUserDto } from '../../user/dto/user/full-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<FullUserDto> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    if (!user.verified) throw new ForbiddenException(`User isn't verified`);
    return user;
  }
}
