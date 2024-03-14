import { FullUserDto } from '../user/full-user.dto';
import { CreateUserDto } from '../user/create-user.dto';

export class OwnershipDto {
  owners: (FullUserDto | CreateUserDto[`_id`])[];
  guests: (FullUserDto | CreateUserDto[`_id`])[];
}
