import { FullUserDto } from '../dto/full-user.dto';
import { Request } from 'express';

declare global {
  namespace Express {
    interface User extends FullUserDto {}
  }
}
