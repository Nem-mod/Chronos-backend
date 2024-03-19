import { PartialType } from '@nestjs/swagger';
import { UpdateRecurrenceSettingsDto } from './update-recurrence-settings.dto';

export class FullRecurrenceSettingsDto extends PartialType(
  UpdateRecurrenceSettingsDto,
) {}
