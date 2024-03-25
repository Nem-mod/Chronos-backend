import { Injectable } from '@nestjs/common';
import { VisibilitySettingsDto } from './dto/visibility-settings.dto';
import { VisibilitySettings } from './models/visibility-settings.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VisibilitySettingsService {
  constructor(
    @InjectModel(VisibilitySettings.name)
    private readonly visibilitySettingsModel: Model<VisibilitySettings>,
  ) {}

  async createModel(
    visibilitySettings: VisibilitySettingsDto,
  ): Promise<VisibilitySettings | undefined> {
    if (!visibilitySettings) return undefined;
    return new this.visibilitySettingsModel(visibilitySettings);
  }
} //TODO: put here createModel function
