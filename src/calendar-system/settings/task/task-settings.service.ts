import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskSettings } from './models/task.settings.model';
import { Model } from 'mongoose';
import { TaskSettingsDto } from './dto/task-settings.dto';

@Injectable()
export class TaskSettingsService {
  constructor(
    @InjectModel(TaskSettings.name)
    private readonly taskSettingsModel: Model<TaskSettings>,
  ) {}

  async createModel(
    taskSettings: TaskSettingsDto,
  ): Promise<TaskSettings | undefined> {
    if (!taskSettings) return undefined;
    return new this.taskSettingsModel(taskSettings);
  }
}
