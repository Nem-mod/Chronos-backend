import { Request as RequestType } from 'express';
import { FullEventDto } from '../dto/full-event.dto';

export const getEventIdFromRequest = async (
  req: RequestType,
): Promise<FullEventDto[`_id`]> => {
  return (
    req.body._id || req.body.event || req.body.event?._id || req.query.eventId
  );
};
