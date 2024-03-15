import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../../user/models/user.model';
import { CalendarEntry } from '../../calendar-entry/models/calendar-entry.model';
import { FullUserDto } from '../../../user/dto/user/full-user.dto';
import { CreateUserDto } from '../../../user/dto/user/create-user.dto';
import { FullCalendarEntryDto } from '../../calendar-entry/dto/full-calendar-entry.dto';
import { CreateCalendarEntryDto } from '../../calendar-entry/dto/create-calendar-entry.dto';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCalendarListDto {
  @IsDefined()
  @IsString()
  _id?: FullUserDto | CreateUserDto[`_id`];
}
