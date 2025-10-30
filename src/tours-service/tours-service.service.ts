import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToursServiceEntity } from './entities/tours-service.entity';
import { DestinationEntity } from './entities/destination.entity';
import { CreateToursServiceDto } from './dto/create-tours-service.dto';
import { UpdateToursServiceDto } from './dto/update-tours-service.dto';

@Injectable()
export class ToursServiceService {
  private readonly logger = new Logger(ToursServiceService.name);

  constructor(
    @InjectRepository(ToursServiceEntity)
    private readonly toursRepository: Repository<ToursServiceEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinationRepository: Repository<DestinationEntity>,
  ) {}

  async create(createToursServiceDto: CreateToursServiceDto) {
    try {
      const { destinations, ...tourData } = createToursServiceDto;

      const tour = this.toursRepository.create(tourData);
      const savedTour = await this.toursRepository.save(tour);

      if (destinations && destinations.length > 0) {
        const destinationEntities = destinations.map((dest) =>
          this.destinationRepository.create({
            ...dest,
            tour: savedTour,
          }),
        );
        await this.destinationRepository.save(destinationEntities);
      }

      const fullTour = await this.toursRepository.findOne({
        where: { id: savedTour.id },
        relations: ['destinations'],
      });

      return fullTour;
    } catch (error) {
      this.logger.error(`Error creating tour: ${error.message}`);
      throw new InternalServerErrorException('Failed to create tour');
    }
  }

  async findAll() {
    try {
      const tours = await this.toursRepository.find({
        relations: ['destinations'],
      });

      if (tours.length === 0) {
        this.logger.warn('⚠️ No tours found in database');
      } else {
        this.logger.log(`✅ Retrieved ${tours.length} tours`);
      }

      return tours;
    } catch (error) {
      this.logger.error(`Error fetching tours: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch tours');
    }
  }

  async findOne(id: string) {
    try {
      // Validate ID format
      if (!id || isNaN(Number(id))) {
        throw new BadRequestException('Invalid tour ID format');
      }

      const tourId = Number(id);
      const tour = await this.toursRepository.findOne({
        where: { id: tourId },
        relations: ['destinations'],
      });

      if (!tour) {
        this.logger.warn(`⚠️ Tour with ID ${tourId} not found`);
        throw new NotFoundException(`Tour with ID ${tourId} does not exist`);
      }

      return tour;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Error fetching tour ${id}: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch tour');
    }
  }

  async findByRegion(region: string) {
    try {
      if (!region || region.trim().length === 0) {
        throw new BadRequestException('Region parameter is required');
      }

      const tours = await this.toursRepository
        .createQueryBuilder('tour')
        .where("tour.region->>'en' = :region", { region: region.trim() })
        .leftJoinAndSelect('tour.destinations', 'destination')
        .getMany();

      if (tours.length === 0) {
        this.logger.warn(`⚠️ No tours found for region: ${region}`);
      } else {
        this.logger.log(`✅ Found ${tours.length} tours in region: ${region}`);
      }

      return tours;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error fetching tours by region ${region}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to fetch tours by region');
    }
  }

  async update(id: string, updateToursServiceDto: UpdateToursServiceDto) {
    try {
      // Validate ID format
      if (!id || isNaN(Number(id))) {
        throw new BadRequestException('Invalid tour ID format');
      }

      const tourId = Number(id);
      const tour = await this.findOne(id);

      // Delete old destinations if new ones are provided
      if (
        updateToursServiceDto.destinations &&
        updateToursServiceDto.destinations.length > 0
      ) {
        await this.destinationRepository.delete({ tour: { id: tourId } });

        const newDestinations = updateToursServiceDto.destinations.map((dest) =>
          this.destinationRepository.create({
            ...dest,
            tour,
          }),
        );
        await this.destinationRepository.save(newDestinations);
      }

      // Update tour data
      Object.assign(tour, updateToursServiceDto);
      const updatedTour = await this.toursRepository.save(tour);

      this.logger.log(
        `✅ Tour ${tourId} updated successfully with ${updateToursServiceDto.destinations?.length || 0} destinations`,
      );
      return updatedTour;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`❌ Error updating tour ${id}: ${error.message}`);
      throw new InternalServerErrorException('Failed to update tour');
    }
  }

  async remove(id: string) {
    try {
      // Validate ID format
      if (!id || isNaN(Number(id))) {
        throw new BadRequestException('Invalid tour ID format');
      }

      const tourId = Number(id);
      const tour = await this.findOne(id);

      // Delete destinations first (if not cascading)
      await this.destinationRepository.delete({ tour: { id: tourId } });

      // Delete tour
      await this.toursRepository.remove(tour);

      this.logger.log(`✅ Tour ${tourId} successfully deleted`);
      return {
        success: true,
        message: `Tour with ID ${tourId} has been successfully deleted`,
        deletedId: tourId,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`❌ Error deleting tour ${id}: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete tour');
    }
  }
}
