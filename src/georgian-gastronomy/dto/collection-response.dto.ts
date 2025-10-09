// dto/collection-response.dto.ts
import { LocalizedTextDto } from './localized-text.dto';

export class DishResponseDto {
  id: number;
  image: string;
  href: string;
  header: LocalizedTextDto;
  title?: LocalizedTextDto;
  text?: LocalizedTextDto;
  description?: LocalizedTextDto;
}

export class CollectionResponseDto {
  id: string;
  title: string;
  array: DishResponseDto[];
}
