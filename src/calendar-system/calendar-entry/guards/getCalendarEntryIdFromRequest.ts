import { FullCalendarEntryDto } from '../dto/full-calendar-entry.dto';

export const getCalendarEntryFromRequest = async (
  req: any,
): Promise<FullCalendarEntryDto[`_id`]> => {
  return (
    req.body._id ||
    req.body.calendarEntry ||
    req.body.calendarEntry?._id ||
    req.query.calendarEntryId
  );
};
