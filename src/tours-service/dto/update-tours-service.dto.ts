import { PartialType } from '@nestjs/mapped-types';
import { CreateToursServiceDto } from './create-tours-service.dto';

export class UpdateToursServiceDto extends PartialType(CreateToursServiceDto) {}
