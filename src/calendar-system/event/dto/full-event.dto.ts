import { PartialType } from '@nestjs/swagger';
import { UpdateEventDto } from './update-event.dto';

export class FullEventDto extends PartialType(UpdateEventDto) {}
