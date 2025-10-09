// dto/update-dish.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDishDto } from './create-georgian-gastronomy.dto';

export class UpdateDishDto extends PartialType(CreateDishDto) {}
