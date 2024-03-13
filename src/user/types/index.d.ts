import { FullUserDto } from '../dto/user/full-user.dto';
import { Request } from 'express';

declare global {
  namespace Express {
    interface User extends FullUserDto {}
  }
}
