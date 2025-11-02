// import {
//   Injectable,
//   Logger,
//   NotFoundException,
//   BadRequestException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ToursServiceEntity } from './entities/tours-service.entity';
// import { DestinationEntity } from './entities/destination.entity';
// import { CreateToursServiceDto } from './dto/create-tours-service.dto';
// import { UpdateToursServiceDto } from './dto/update-tours-service.dto';

// @Injectable()
// export class ToursServiceService {
//   private readonly logger = new Logger(ToursServiceService.name);

//   constructor(
//     @InjectRepository(ToursServiceEntity)
//     private readonly toursRepository: Repository<ToursServiceEntity>,
//     @InjectRepository(DestinationEntity)
//     private readonly destinationRepository: Repository<DestinationEntity>,
//   ) {}

//   async create(createToursServiceDto: CreateToursServiceDto) {
//     try {
//       const { destinations, ...tourData } = createToursServiceDto;

//       const tour = this.toursRepository.create(tourData);
//       const savedTour = await this.toursRepository.save(tour);

//       if (destinations && destinations.length > 0) {
//         const destinationEntities = destinations.map((dest) =>
//           this.destinationRepository.create({
//             ...dest,
//             tour: savedTour,
//           }),
//         );
//         await this.destinationRepository.save(destinationEntities);
//       }

//       const fullTour = await this.toursRepository.findOne({
//         where: { id: savedTour.id },
//         relations: ['destinations'],
//       });

//       return fullTour;
//     } catch (error) {
//       this.logger.error(`Error creating tour: ${error.message}`);
//       throw new InternalServerErrorException('Failed to create tour');
//     }
//   }

//   async findAll() {
//     try {
//       const tours = await this.toursRepository.find({
//         relations: ['destinations'],
//       });

//       if (tours.length === 0) {
//         this.logger.warn('⚠️ No tours found in database');
//       } else {
//         this.logger.log(`✅ Retrieved ${tours.length} tours`);
//       }

//       return tours;
//     } catch (error) {
//       this.logger.error(`Error fetching tours: ${error.message}`);
//       throw new InternalServerErrorException('Failed to fetch tours');
//     }
//   }

//   async findOne(id: string) {
//     try {
//       // Validate ID format
//       if (!id || isNaN(Number(id))) {
//         throw new BadRequestException('Invalid tour ID format');
//       }

//       const tourId = Number(id);
//       const tour = await this.toursRepository.findOne({
//         where: { id: tourId },
//         relations: ['destinations'],
//       });

//       if (!tour) {
//         this.logger.warn(`⚠️ Tour with ID ${tourId} not found`);
//         throw new NotFoundException(`Tour with ID ${tourId} does not exist`);
//       }

//       return tour;
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(`Error fetching tour ${id}: ${error.message}`);
//       throw new InternalServerErrorException('Failed to fetch tour');
//     }
//   }

//   async findByRegion(region: string) {
//     try {
//       if (!region || region.trim().length === 0) {
//         throw new BadRequestException('Region parameter is required');
//       }

//       const tours = await this.toursRepository
//         .createQueryBuilder('tour')
//         .where("tour.region->>'en' = :region", { region: region.trim() })
//         .leftJoinAndSelect('tour.destinations', 'destination')
//         .getMany();

//       if (tours.length === 0) {
//         this.logger.warn(`⚠️ No tours found for region: ${region}`);
//       } else {
//         this.logger.log(`✅ Found ${tours.length} tours in region: ${region}`);
//       }

//       return tours;
//     } catch (error) {
//       if (error instanceof BadRequestException) {
//         throw error;
//       }
//       this.logger.error(
//         `Error fetching tours by region ${region}: ${error.message}`,
//       );
//       throw new InternalServerErrorException('Failed to fetch tours by region');
//     }
//   }

//   async update(id: string, updateToursServiceDto: UpdateToursServiceDto) {
//     try {
//       // Validate ID format
//       if (!id || isNaN(Number(id))) {
//         throw new BadRequestException('Invalid tour ID format');
//       }

//       const tourId = Number(id);
//       const tour = await this.findOne(id);

//       // Delete old destinations if new ones are provided
//       if (
//         updateToursServiceDto.destinations &&
//         updateToursServiceDto.destinations.length > 0
//       ) {
//         await this.destinationRepository.delete({ tour: { id: tourId } });

//         const newDestinations = updateToursServiceDto.destinations.map((dest) =>
//           this.destinationRepository.create({
//             ...dest,
//             tour,
//           }),
//         );
//         await this.destinationRepository.save(newDestinations);
//       }

//       // Update tour data
//       Object.assign(tour, updateToursServiceDto);
//       const updatedTour = await this.toursRepository.save(tour);

//       this.logger.log(
//         `✅ Tour ${tourId} updated successfully with ${updateToursServiceDto.destinations?.length || 0} destinations`,
//       );
//       return updatedTour;
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(`❌ Error updating tour ${id}: ${error.message}`);
//       throw new InternalServerErrorException('Failed to update tour');
//     }
//   }

//   async remove(id: string) {
//     try {
//       // Validate ID format
//       if (!id || isNaN(Number(id))) {
//         throw new BadRequestException('Invalid tour ID format');
//       }

//       const tourId = Number(id);
//       const tour = await this.findOne(id);

//       // Delete destinations first (if not cascading)
//       await this.destinationRepository.delete({ tour: { id: tourId } });

//       // Delete tour
//       await this.toursRepository.remove(tour);

//       this.logger.log(`✅ Tour ${tourId} successfully deleted`);
//       return {
//         success: true,
//         message: `Tour with ID ${tourId} has been successfully deleted`,
//         deletedId: tourId,
//       };
//     } catch (error) {
//       if (
//         error instanceof NotFoundException ||
//         error instanceof BadRequestException
//       ) {
//         throw error;
//       }
//       this.logger.error(`❌ Error deleting tour ${id}: ${error.message}`);
//       throw new InternalServerErrorException('Failed to delete tour');
//     }
//   }
// }

// ------------------------------------------------------------

// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Card } from './entities/card.entity';
// import { PopularTour } from './entities/popular-tour.entity';
// import { CreateCardDto } from './dto/create-tour.dto';
// import { UpdateCardDto } from './dto/update-tours-service.dto';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

// @Injectable()
// export class ToursServiceService {
//   constructor(
//     @InjectRepository(Card)
//     private cardRepository: Repository<Card>,
//     @InjectRepository(PopularTour)
//     private popularTourRepository: Repository<PopularTour>,
//     private cloudinaryService: CloudinaryService,
//   ) {}

//   // 📌 CARD CRUD

//   async createCard(createCardDto: CreateCardDto): Promise<Card> {
//     try {
//       const card = this.cardRepository.create(createCardDto);
//       return await this.cardRepository.save(card);
//     } catch (error) {
//       throw new BadRequestException(`Failed to create card: ${error.message}`);
//     }
//   }

//   async uploadCardImage(
//     file: Express.Multer.File,
//   ): Promise<{ url: string; publicId: string }> {
//     try {
//       if (!file) {
//         throw new BadRequestException('No file provided');
//       }

//       const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
//       return await this.cloudinaryService.uploadImage(base64, 'tours/cards');
//     } catch (error) {
//       throw new BadRequestException(`Image upload failed: ${error.message}`);
//     }
//   }

//   async uploadTourImage(
//     file: Express.Multer.File,
//   ): Promise<{ url: string; publicId: string }> {
//     try {
//       if (!file) {
//         throw new BadRequestException('No file provided');
//       }

//       const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
//       return await this.cloudinaryService.uploadImage(base64, 'tours/popular');
//     } catch (error) {
//       throw new BadRequestException(`Image upload failed: ${error.message}`);
//     }
//   }

//   async getAllCards(): Promise<Card[]> {
//     return await this.cardRepository.find({
//       relations: ['popularTours'],
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async getCardById(id: number): Promise<Card> {
//     const card = await this.cardRepository.findOne({
//       where: { id },
//       relations: ['popularTours'],
//     });

//     if (!card) {
//       throw new NotFoundException(`Card with ID ${id} not found`);
//     }

//     return card;
//   }

//   async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
//     const card = await this.getCardById(id);
//     Object.assign(card, updateCardDto);
//     return await this.cardRepository.save(card);
//   }

//   async deleteCard(id: number): Promise<{ message: string }> {
//     const card = await this.getCardById(id);

//     // Delete image from Cloudinary
//     if (card.image) {
//       const publicId = this.extractPublicIdFromUrl(card.image);
//       if (publicId) {
//         await this.cloudinaryService.deleteImage(publicId);
//       }
//     }

//     await this.cardRepository.remove(card);
//     return { message: `Card with ID ${id} deleted successfully` };
//   }

//   // 📌 POPULAR TOUR CRUD

//   async createPopularTour(
//     cardId: number,
//     createTourDto: any,
//   ): Promise<PopularTour> {
//     const card = await this.getCardById(cardId);
//     const tour = this.popularTourRepository.create({
//       ...createTourDto,
//       card,
//     });

//     return (await this.popularTourRepository.save(tour)) as any;

//   }

//   async getPopularToursByCard(cardId: number): Promise<PopularTour[]> {
//     return await this.popularTourRepository.find({
//       where: { card: { id: cardId } },
//     });
//   }

//   async updatePopularTour(
//     tourId: number,
//     updateTourDto: any,
//   ): Promise<PopularTour> {
//     const tour = await this.popularTourRepository.findOne({
//       where: { id: tourId },
//     });

//     if (!tour) {
//       throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
//     }

//     Object.assign(tour, updateTourDto);
//     return await this.popularTourRepository.save(tour);
//   }

//   async deletePopularTour(tourId: number): Promise<{ message: string }> {
//     const tour = await this.popularTourRepository.findOne({
//       where: { id: tourId },
//     });

//     if (!tour) {
//       throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
//     }

//     // Delete image from Cloudinary
//     if (tour.image) {
//       const publicId = this.extractPublicIdFromUrl(tour.image);
//       if (publicId) {
//         await this.cloudinaryService.deleteImage(publicId);
//       }
//     }

//     await this.popularTourRepository.remove(tour);
//     return { message: `Popular Tour with ID ${tourId} deleted successfully` };
//   }

//   // 📌 SEED DATABASE

//   async seedDatabase(cardSliderImages: CreateCardDto[]): Promise<Card[]> {
//     const existingCards = await this.cardRepository.count();

//     if (existingCards > 0) {
//       return await this.getAllCards();
//     }

//     const createdCards: Card[] = [];

//     for (const cardData of cardSliderImages) {
//       const card = await this.createCard(cardData);
//       createdCards.push(card);
//     }

//     return createdCards;
//   }

//   // 📌 HELPER METHOD

//   private extractPublicIdFromUrl(url: string): string | null {
//     try {
//       const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
//       return match ? match[1] : null;
//     } catch {
//       return null;
//     }
//   }
// }
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { PopularTour } from './entities/popular-tour.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCardDto } from './dto/create-tour.dto';
import { UpdateCardDto } from './dto/update-tours-service.dto';

@Injectable()
export class ToursServiceService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(PopularTour)
    private popularTourRepository: Repository<PopularTour>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 📌 CARD CRUD

  async createCard(
    createCardDto: CreateCardDto,
    base64Image?: string,
  ): Promise<Card> {
    try {
      let imageUrl = createCardDto.image;

      if (base64Image) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          base64Image,
          'tours/cards',
        );
        imageUrl = uploadResult.url;
      }

      const card = this.cardRepository.create({
        ...createCardDto,
        image: imageUrl,
      });

      return await this.cardRepository.save(card);
    } catch (error) {
      throw new BadRequestException(`Failed to create card: ${error.message}`);
    }
  }

  async getAllCards(): Promise<Card[]> {
    return await this.cardRepository.find({
      relations: ['popularTours'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCardById(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['popularTours'],
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async updateCard(
    id: number,
    updateCardDto: UpdateCardDto,
    base64Image?: string,
  ): Promise<Card> {
    const card = await this.getCardById(id);

    let imageUrl = card.image;

    if (base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        base64Image,
        'tours/cards',
      );
      imageUrl = uploadResult.url;
    }

    Object.assign(card, {
      ...updateCardDto,
      image: imageUrl,
    });

    return await this.cardRepository.save(card);
  }

  async deleteCard(id: number): Promise<{ message: string }> {
    const card = await this.getCardById(id);
    await this.cardRepository.remove(card);
    return { message: `Card with ID ${id} deleted successfully` };
  }

  // 📌 POPULAR TOUR CRUD

  async createPopularTour(
    cardId: number,
    createTourDto: any,
    base64Image?: string,
  ): Promise<PopularTour> {
    const card = await this.getCardById(cardId);

    let imageUrl = createTourDto.image;

    if (base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        base64Image,
        'tours/popular-tours',
      );
      imageUrl = uploadResult.url;
    }

    const tour = this.popularTourRepository.create({
      ...createTourDto,
      image: imageUrl,
      card,
    });

    return (await this.popularTourRepository.save(tour)) as any;
  }

  async getPopularToursByCard(cardId: number): Promise<PopularTour[]> {
    return await this.popularTourRepository.find({
      where: { card: { id: cardId } },
    });
  }

  async updatePopularTour(
    tourId: number,
    updateTourDto: any,
    base64Image?: string,
  ): Promise<PopularTour> {
    const tour = await this.popularTourRepository.findOne({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
    }

    let imageUrl = tour.image;

    if (base64Image) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        base64Image,
        'tours/popular-tours',
      );
      imageUrl = uploadResult.url;
    }

    Object.assign(tour, {
      ...updateTourDto,
      image: imageUrl,
    });

    return await this.popularTourRepository.save(tour);
  }

  async deletePopularTour(tourId: number): Promise<{ message: string }> {
    const tour = await this.popularTourRepository.findOne({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
    }

    await this.popularTourRepository.remove(tour);
    return { message: `Popular Tour with ID ${tourId} deleted successfully` };
  }

  // 📌 SEED DATABASE

  async seedDatabase(cardSliderImages: CreateCardDto[]): Promise<Card[]> {
    const existingCards = await this.cardRepository.count();

    if (existingCards > 0) {
      return await this.getAllCards();
    }

    const createdCards: Card[] = [];

    for (const cardData of cardSliderImages) {
      const card = await this.createCard(cardData);
      createdCards.push(card);
    }

    return createdCards;
  }
}
