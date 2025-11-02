// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Card } from './entities/card.entity';
// import { PopularTour } from './entities/popular-tour.entity';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { CreateCardDto } from './dto/create-tour.dto';
// import { UpdateCardDto } from './dto/update-tours-service.dto';

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

//   async createCard(
//     createCardDto: CreateCardDto,
//     imageFile?: any,
//   ): Promise<Card> {
//     try {
//       let imageUrl = createCardDto.image;

//       if (imageFile) {
//         const uploadResult = await this.cloudinaryService.uploadImage(
//           imageFile.buffer.toString('base64'),
//           'tours/cards',
//         );
//         imageUrl = uploadResult.url;
//       }

//       const card = this.cardRepository.create({
//         ...createCardDto,
//         image: imageUrl,
//       });

//       return await this.cardRepository.save(card);
//     } catch (error) {
//       throw new BadRequestException(`Failed to create card: ${error.message}`);
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

//   async updateCard(
//     id: number,
//     updateCardDto: UpdateCardDto,
//     imageFile?: any,
//   ): Promise<Card> {
//     const card = await this.getCardById(id);

//     let imageUrl = updateCardDto.image;

//     if (imageFile) {
//       const uploadResult = await this.cloudinaryService.uploadImage(
//         imageFile.buffer.toString('base64'),
//         'tours/cards',
//       );
//       imageUrl = uploadResult.url;
//     }

//     Object.assign(card, { ...updateCardDto, image: imageUrl });
//     return await this.cardRepository.save(card);
//   }

//   async deleteCard(id: number): Promise<{ message: string }> {
//     const card = await this.getCardById(id);
//     await this.cardRepository.remove(card);
//     return { message: `Card with ID ${id} deleted successfully` };
//   }

//   // 📌 POPULAR TOUR CRUD

//   async createPopularTour(
//     cardId: number,
//     createTourDto: any,
//     imageFile?: any,
//   ): Promise<PopularTour> {
//     const card = await this.getCardById(cardId);

//     let imageUrl = createTourDto.image;

//     if (imageFile) {
//       const uploadResult = await this.cloudinaryService.uploadImage(
//         imageFile.buffer.toString('base64'),
//         'tours/popular-tours',
//       );
//       imageUrl = uploadResult.url;
//     }

//     const tour = this.popularTourRepository.create({
//       ...createTourDto,
//       image: imageUrl,
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
//     imageFile?: any,
//   ): Promise<PopularTour> {
//     const tour = await this.popularTourRepository.findOne({
//       where: { id: tourId },
//     });

//     if (!tour) {
//       throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
//     }

//     let imageUrl = updateTourDto.image;

//     if (imageFile) {
//       const uploadResult = await this.cloudinaryService.uploadImage(
//         imageFile.buffer.toString('base64'),
//         'tours/popular-tours',
//       );
//       imageUrl = uploadResult.url;
//     }

//     Object.assign(tour, { ...updateTourDto, image: imageUrl });
//     return await this.popularTourRepository.save(tour);
//   }

//   async deletePopularTour(tourId: number): Promise<{ message: string }> {
//     const tour = await this.popularTourRepository.findOne({
//       where: { id: tourId },
//     });

//     if (!tour) {
//       throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
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
// }

// tours-service.service.ts (განახლებული createPopularTour)

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { PopularTour } from './entities/popular-tour.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCardDto, CreatePopularTourDto } from './dto/create-tour.dto';
import { UpdateCardDto } from './dto/update-tours-service.dto';

@Injectable()
export class ToursServiceService {
  private readonly logger = new Logger(ToursServiceService.name);

  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(PopularTour)
    private popularTourRepository: Repository<PopularTour>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 📌 HELPER METHODS

  private isBase64Image(str: string): boolean {
    if (!str || typeof str !== 'string') {
      return false;
    }

    return str.startsWith('data:image/') || str.startsWith('data:application/');
  }

  private async processImage(image: string, folder: string): Promise<string> {
    if (!image) {
      throw new BadRequestException('Image is required');
    }

    // თუ უკვე URL არის, დააბრუნე ისე როგორც არის
    if (image.startsWith('http')) {
      return image;
    }

    // თუ base64 არის, აიტვირთე
    if (this.isBase64Image(image)) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(
          image,
          folder,
        );
        return uploadResult.url;
      } catch (error) {
        this.logger.error(`Failed to upload image to ${folder}:`, error);
        throw new BadRequestException(`Image upload failed: ${error.message}`);
      }
    }

    throw new BadRequestException(
      'Image must be either a base64 string or a valid URL',
    );
  }

  // 📌 CARD CRUD

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    try {
      this.logger.log('🔄 Processing card images...');

      // ✅ დამუშავე card-ის სურათი
      const cardImage = await this.processImage(
        createCardDto.image,
        'tours/cards',
      );

      // ✅ დამუშავე popularTours სურათები
      let processedPopularTours: CreatePopularTourDto[] = [];
      if (createCardDto.popularTours && createCardDto.popularTours.length > 0) {
        this.logger.log(
          `🔄 Processing ${createCardDto.popularTours.length} popular tour images...`,
        );

        processedPopularTours = await Promise.all(
          createCardDto.popularTours.map(async (tour) => {
            const tourImage = await this.processImage(
              tour.image,
              'tours/popular-tours',
            );
            return {
              ...tour,
              image: tourImage,
            };
          }),
        );

        this.logger.log(
          `✅ All ${processedPopularTours.length} popular tour images processed`,
        );
      }

      // ✅ შექმენი card
      const card = this.cardRepository.create({
        ...createCardDto,
        image: cardImage,
        popularTours: processedPopularTours as any,
      });

      const savedCard = await this.cardRepository.save(card);
      this.logger.log(
        `✅ Card created with ID: ${savedCard.id} and ${savedCard.popularTours?.length || 0} popular tours`,
      );

      return savedCard;
    } catch (error) {
      this.logger.error('❌ Failed to create card:', error.message);
      throw error;
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

  async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    try {
      const card = await this.getCardById(id);

      this.logger.log(`🔄 Updating card ID: ${id}`);

      // ✅ დამუშავე card-ის სურათი
      let cardImage = card.image;
      if (updateCardDto.image) {
        cardImage = await this.processImage(updateCardDto.image, 'tours/cards');
      }

      // ✅ დამუშავე popularTours სურათები თუ გაწერილი არიან
      let processedPopularTours = card.popularTours;
      if (updateCardDto.popularTours && updateCardDto.popularTours.length > 0) {
        processedPopularTours = (await Promise.all(
          updateCardDto.popularTours.map(async (tour) => {
            const tourImage = await this.processImage(
              tour.image,
              'tours/popular-tours',
            );
            return {
              ...tour,
              image: tourImage,
            };
          }),
        )) as any;
      }

      Object.assign(card, {
        ...updateCardDto,
        image: cardImage,
        popularTours: processedPopularTours,
      });

      await this.cardRepository.save(card);
      this.logger.log(`✅ Card updated with ID: ${id}`);

      return card;
    } catch (error) {
      this.logger.error('❌ Failed to update card:', error.message);
      throw error;
    }
  }

  async deleteCard(id: number): Promise<{ message: string }> {
    const card = await this.getCardById(id);
    await this.cardRepository.remove(card);
    this.logger.log(`✅ Card deleted with ID: ${id}`);

    return { message: `Card with ID ${id} deleted successfully` };
  }

  // 📌 POPULAR TOUR CRUD

  async createPopularTour(
    cardId: number,
    createTourDto: CreatePopularTourDto,
  ): Promise<PopularTour> {
    try {
      const card = await this.getCardById(cardId);

      this.logger.log(`🔄 Creating popular tour for card ID: ${cardId}`);

      // ✅ დამუშავე სურათი
      const tourImage = await this.processImage(
        createTourDto.image,
        'tours/popular-tours',
      );

      const tour = this.popularTourRepository.create({
        ...createTourDto,
        image: tourImage,
        card,
      });

      const savedTour = await this.popularTourRepository.save(tour);
      this.logger.log(`✅ Popular tour created with ID: ${savedTour.id}`);

      return savedTour;
    } catch (error) {
      this.logger.error('❌ Failed to create popular tour:', error.message);
      throw error;
    }
  }

  async getPopularToursByCard(cardId: number): Promise<PopularTour[]> {
    return await this.popularTourRepository.find({
      where: { card: { id: cardId } },
    });
  }

  async updatePopularTour(
    tourId: number,
    updateTourDto: CreatePopularTourDto,
  ): Promise<PopularTour> {
    try {
      const tour = await this.popularTourRepository.findOne({
        where: { id: tourId },
      });

      if (!tour) {
        throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
      }

      this.logger.log(`🔄 Updating popular tour ID: ${tourId}`);

      // ✅ დამუშავე სურათი
      let tourImage = tour.image;
      if (updateTourDto.image) {
        tourImage = await this.processImage(
          updateTourDto.image,
          'tours/popular-tours',
        );
      }

      Object.assign(tour, { ...updateTourDto, image: tourImage });
      await this.popularTourRepository.save(tour);
      this.logger.log(`✅ Popular tour updated with ID: ${tourId}`);

      return tour;
    } catch (error) {
      this.logger.error('❌ Failed to update popular tour:', error.message);
      throw error;
    }
  }

  async deletePopularTour(tourId: number): Promise<{ message: string }> {
    const tour = await this.popularTourRepository.findOne({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
    }

    await this.popularTourRepository.remove(tour);
    this.logger.log(`✅ Popular tour deleted with ID: ${tourId}`);

    return { message: `Popular Tour with ID ${tourId} deleted successfully` };
  }

  // 📌 SEED DATABASE

  async seedDatabase(cardSliderImages: CreateCardDto[]): Promise<Card[]> {
    const existingCards = await this.cardRepository.count();

    if (existingCards > 0) {
      this.logger.log('📌 Database already seeded');
      return await this.getAllCards();
    }

    this.logger.log(
      `🌱 Seeding database with ${cardSliderImages.length} cards`,
    );
    const createdCards: Card[] = [];

    for (const cardData of cardSliderImages) {
      const card = await this.createCard(cardData);
      createdCards.push(card);
    }

    this.logger.log(`✅ Database seeded successfully`);
    return createdCards;
  }
}
