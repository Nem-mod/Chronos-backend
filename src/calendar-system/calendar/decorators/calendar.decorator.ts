import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqCalendar = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.calendar;
  },
);
