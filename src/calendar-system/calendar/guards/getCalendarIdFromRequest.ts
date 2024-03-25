import { Request as RequestType } from 'express';
import { FullCalendarDto } from '../dto/full-calendar.dto';

export const getCalendarIdFromRequest = async (
  req: RequestType,
): Promise<FullCalendarDto[`_id`]> => {
  return (
    req.body._id ||
    req.body.calendar ||
    req.body.calendar?._id ||
    req.query.calendarId
  );
};
