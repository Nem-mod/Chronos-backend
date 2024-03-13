import { Controller, ForbiddenException, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CalendarService } from './calendar.service';

@Controller({
  path: `calendar`,
  version: `1`,
})
export class CalendarController {
  constructor(
    private readonly configService: ConfigService,
    private readonly calendarService: CalendarService,
  ) {}

  @HttpCode(204)
  @Post(`timezones`)
  async fillTimezoneDatabase() {
    if (this.configService.get(`stage`) !== `develop`)
      throw new ForbiddenException(`This endpoint is only for development`);
    await this.calendarService.fillTimezoneDatabase();
  }
}
