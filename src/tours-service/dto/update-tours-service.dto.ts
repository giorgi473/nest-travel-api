import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-tour.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
