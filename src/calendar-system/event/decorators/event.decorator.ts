import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqEvent = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.event;
  },
);
