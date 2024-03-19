import { PartialType } from '@nestjs/swagger';
import { CreateRecurrenceSettingsDto } from './create-recurrence-settings.dto';

export class UpdateRecurrenceSettingsDto extends PartialType(
  CreateRecurrenceSettingsDto,
) {}
