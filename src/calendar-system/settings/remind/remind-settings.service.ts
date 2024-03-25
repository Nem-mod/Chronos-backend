import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RemindSettings } from './models/remind-settings.model';
import { Model } from 'mongoose';
import { RemindSettingsDto } from './dto/remind-settings.dto';

@Injectable()
export class RemindSettingsService {
  constructor(
    @InjectModel(RemindSettings.name)
    private readonly remindSettingsModel: Model<RemindSettings>,
  ) {}

  async createModel(
    remindSettings: RemindSettingsDto,
  ): Promise<RemindSettings | undefined> {
    if (!remindSettings) return undefined;
    return new this.remindSettingsModel(remindSettings);
  }
} //TODO: put here createModel function
