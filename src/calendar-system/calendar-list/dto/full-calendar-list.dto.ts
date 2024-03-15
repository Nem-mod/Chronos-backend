import { PartialType } from '@nestjs/swagger';
import { UpdateCalendarListDto } from './update-calendar-list.dto';

export class FullCalendarListDto extends PartialType(UpdateCalendarListDto) {}
