import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import timezones from 'timezones-list';
import { InjectModel } from '@nestjs/mongoose';
import { Timezone } from './models/timezone.model';
import { Model } from 'mongoose';
import { TimezonteDto } from './dto/timezonte.dto';

@Injectable()
export class TimezonesService {
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

  async findTimezoneByCode(tzCode: TimezonteDto[`_id`]): Promise<Timezone> {
    const timezone: Timezone = await this.timezoneModel.findById(tzCode);
    if (!timezone) throw new NotFoundException(`Timezone not found`);
    return timezone;
  }
}
