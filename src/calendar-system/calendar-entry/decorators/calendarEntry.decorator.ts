import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqCalendarEntry = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.calendarEntry;
  },
);
