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

  // 📌 CARD CRUD

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    try {
      let imageUrl = createCardDto.image;

      // ✅ თუ base64 არის, აიტვირთე
      if (
        createCardDto.image.startsWith('data:image') ||
        createCardDto.image.startsWith('data:application')
      ) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          createCardDto.image,
          'tours/cards',
        );
        imageUrl = uploadResult.url;
      }

      const card = this.cardRepository.create({
        ...createCardDto,
        image: imageUrl,
      });

      const savedCard = await this.cardRepository.save(card);
      this.logger.log(`✅ Card created with ID: ${savedCard.id}`);

      return savedCard;
    } catch (error) {
      this.logger.error('❌ Failed to create card:', error.message);
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
  ): Promise<Card> {
    const card = await this.getCardById(id);

    let imageUrl = updateCardDto.image || card.image;

    if (
      updateCardDto.image &&
      (updateCardDto.image.startsWith('data:image') ||
        updateCardDto.image.startsWith('data:application'))
    ) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        updateCardDto.image,
        'tours/cards',
      );
      imageUrl = uploadResult.url;
    }

    Object.assign(card, { ...updateCardDto, image: imageUrl });
    await this.cardRepository.save(card);
    this.logger.log(`✅ Card updated with ID: ${id}`);

    return card;
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
    const card = await this.getCardById(cardId);

    let imageUrl = createTourDto.image;

    if (
      createTourDto.image.startsWith('data:image') ||
      createTourDto.image.startsWith('data:application')
    ) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        createTourDto.image,
        'tours/popular-tours',
      );
      imageUrl = uploadResult.url;
    }

    const tour = this.popularTourRepository.create({
      ...createTourDto,
      image: imageUrl,
      card,
    });

    const savedTour = await this.popularTourRepository.save(tour);
    this.logger.log(`✅ Popular tour created with ID: ${savedTour.id}`);

    return savedTour;
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
    const tour = await this.popularTourRepository.findOne({
      where: { id: tourId },
    });

    if (!tour) {
      throw new NotFoundException(`Popular Tour with ID ${tourId} not found`);
    }

    let imageUrl = updateTourDto.image || tour.image;

    if (
      updateTourDto.image &&
      (updateTourDto.image.startsWith('data:image') ||
        updateTourDto.image.startsWith('data:application'))
    ) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        updateTourDto.image,
        'tours/popular-tours',
      );
      imageUrl = uploadResult.url;
    }

    Object.assign(tour, { ...updateTourDto, image: imageUrl });
    await this.popularTourRepository.save(tour);
    this.logger.log(`✅ Popular tour updated with ID: ${tourId}`);

    return tour;
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
      this.logger.log('📌 Database already seeded, returning existing cards');
      return await this.getAllCards();
    }

    this.logger.log(`🌱 Seeding database with ${cardSliderImages.length} cards`);
    const createdCards: Card[] = [];

    for (const cardData of cardSliderImages) {
      const card = await this.createCard(cardData);
      createdCards.push(card);
    }

    this.logger.log(`✅ Database seeded successfully`);
    return createdCards;
  }
}