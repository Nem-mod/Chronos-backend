import { Calendar } from '../../models/calendar.model';
import { FullCalendarDto } from '../calendar/full-calendar.dto';
import { CreateCalendarDto } from '../calendar/create-calendar.dto';
import { RemindSetting } from '../../models/settings/remind-setting.model';
import { VisibilitySetting } from '../../models/settings/visibility-setting.model';

export class CreateCalendarEntryDto {
  calendarId: FullCalendarDto | CreateCalendarDto[`_id`];
  remindSetting: RemindSetting;
  visibilitySetting: VisibilitySetting;
  // TODO: create calendar-entry dtos, calendar-list dtos, create ownership manipulation functions in userService, work on calendarService
}
