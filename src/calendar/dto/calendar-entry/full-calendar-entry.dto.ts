import { PartialType } from '@nestjs/swagger';
import { UpdateCalendarEntryDto } from './update-calendar-entry.dto';

export class FullCalendarEntryDto extends PartialType(UpdateCalendarEntryDto) {}
