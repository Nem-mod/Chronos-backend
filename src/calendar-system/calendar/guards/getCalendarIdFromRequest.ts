import { Request as RequestType } from 'express';
import { FullCalendarDto } from '../dto/full-calendar.dto';

export const getCalendarIdFromRequest = async (
  req: RequestType,
): Promise<FullCalendarDto[`_id`]> => {
  return (
    req.body._id || req.body.event || req.body.calendar || req.query.calendarId // TODO: wtf is req.body.event. + refactor for getting id from calendar object in body
  );
};
