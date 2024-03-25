import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecurrenceSettings } from './models/recurrence-settings.model';
import { Model } from 'mongoose';
import { CreateRecurrenceSettingsDto } from './dto/create-recurrence-settings.dto';

@Injectable()
export class RecurrenceSettingsService {
  constructor(
    @InjectModel(RecurrenceSettings.name)
    private readonly recurrentSettingsModel: Model<RecurrenceSettings>,
  ) {}

  async createModel(
    recurrentSettings: CreateRecurrenceSettingsDto,
  ): Promise<RecurrenceSettings | undefined> {
    if (!recurrentSettings) return undefined;
    return new this.recurrentSettingsModel(recurrentSettings);
  }
}
