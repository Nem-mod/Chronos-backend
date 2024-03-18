import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../../user/models/user.model';
import { CalendarEntry } from '../../calendar-entry/models/calendar-entry.model';
import { FullUserDto } from '../../../user/dto/full-user.dto';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { FullCalendarEntryDto } from '../../calendar-entry/dto/full-calendar-entry.dto';
import { CreateCalendarEntryDto } from '../../calendar-entry/dto/create-calendar-entry.dto';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCalendarListDto {
  @IsString()
  @IsNotEmpty()
  _id: FullUserDto | CreateUserDto[`_id`];
}
