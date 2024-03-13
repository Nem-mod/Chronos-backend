import { ConflictException, Injectable } from '@nestjs/common';
import timezones from 'timezones-list';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from './models/settings/timezone.model';
import { Model } from 'mongoose';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Timezone.name) private readonly timezoneModel: Model<Timezone>,
  ) {}

  async fillTimezoneDatabase(): Promise<void> {
    try {
      for (const tz of timezones) {
        await new this.timezoneModel({ _id: tz.tzCode, ...tz }).save();
      }
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`Timezones are already filled`);
      console.error(err);
      throw err;
    }
  }
}
