// import { PartialType } from '@nestjs/mapped-types';
// import { CreateToursServiceDto } from './create-tours-service.dto';

// export class UpdateToursServiceDto extends PartialType(CreateToursServiceDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-tour.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
