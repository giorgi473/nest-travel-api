import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { SlideCard } from './entities/slide-card.entity';
import { Blog } from './entities/blog.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(SlideCard)
    private slideCardRepository: Repository<SlideCard>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const destination = new Destination();

    Object.assign(destination, {
      title: createDestinationDto.title,
      src: createDestinationDto.src,
      modalSrc: createDestinationDto.modalSrc,
      additionalDescription: createDestinationDto.additionalDescription,
      region: createDestinationDto.region,
      city: createDestinationDto.city,
      description: createDestinationDto.description,
      name: createDestinationDto.name,
      address: createDestinationDto.address,
      phone: createDestinationDto.phone,
      website: createDestinationDto.website,
      workingHours: createDestinationDto.workingHours,
      anotherSection: createDestinationDto.anotherSection,
    });

    const savedDestination = await this.destinationRepository.save(destination);

    if (
      createDestinationDto.slideCard &&
      createDestinationDto.slideCard.length > 0
    ) {
      const slideCards = createDestinationDto.slideCard.map((sc) => {
        const slideCard = new SlideCard();
        Object.assign(slideCard, sc);
        slideCard.destinationId = savedDestination.id;
        return slideCard;
      });
      await this.slideCardRepository.save(slideCards);
    }

    if (createDestinationDto.blogs && createDestinationDto.blogs.length > 0) {
      const blogs = createDestinationDto.blogs.map((b) => {
        const blog = new Blog();
        Object.assign(blog, b);
        blog.destinationId = savedDestination.id;
        return blog;
      });
      await this.blogRepository.save(blogs);
    }

    return this.findOne(savedDestination.id);
  }

  async findAll(lang?: 'ka' | 'en'): Promise<Destination[]> {
    const destinations = await this.destinationRepository.find({
      relations: ['slideCard', 'blogs'],
      order: { createdAt: 'DESC' },
    });

    if (lang) {
      return destinations.map((dest) => this.transformToLanguage(dest, lang));
    }

    return destinations;
  }

  async findOne(id: number, lang?: 'ka' | 'en'): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({
      where: { id },
      relations: ['slideCard', 'blogs'],
    });

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    if (lang) {
      return this.transformToLanguage(destination, lang);
    }

    return destination;
  }

  async update(
    id: number,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.findOne(id);

    Object.assign(destination, {
      title: updateDestinationDto.title ?? destination.title,
      src: updateDestinationDto.src ?? destination.src,
      modalSrc: updateDestinationDto.modalSrc ?? destination.modalSrc,
      additionalDescription:
        updateDestinationDto.additionalDescription ??
        destination.additionalDescription,
      region: updateDestinationDto.region ?? destination.region,
      city: updateDestinationDto.city ?? destination.city,
      description: updateDestinationDto.description ?? destination.description,
      name: updateDestinationDto.name ?? destination.name,
      address: updateDestinationDto.address ?? destination.address,
      phone: updateDestinationDto.phone ?? destination.phone,
      website: updateDestinationDto.website ?? destination.website,
      workingHours:
        updateDestinationDto.workingHours ?? destination.workingHours,
      anotherSection:
        updateDestinationDto.anotherSection ?? destination.anotherSection,
    });

    await this.destinationRepository.save(destination);

    if (updateDestinationDto.slideCard !== undefined) {
      await this.slideCardRepository.delete({ destinationId: id });
      if (updateDestinationDto.slideCard.length > 0) {
        const slideCards = updateDestinationDto.slideCard.map((sc) => {
          const slideCard = new SlideCard();
          Object.assign(slideCard, sc);
          slideCard.destinationId = id;
          return slideCard;
        });
        await this.slideCardRepository.save(slideCards);
      }
    }

    if (updateDestinationDto.blogs !== undefined) {
      await this.blogRepository.delete({ destinationId: id });
      if (updateDestinationDto.blogs.length > 0) {
        const blogs = updateDestinationDto.blogs.map((b) => {
          const blog = new Blog();
          Object.assign(blog, b);
          blog.destinationId = id;
          return blog;
        });
        await this.blogRepository.save(blogs);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.destinationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
  }

  private transformToLanguage(destination: any, lang: 'ka' | 'en'): any {
    return {
      ...destination,
      title: destination.title?.[lang],
      additionalDescription: destination.additionalDescription?.[lang],
      region: destination.region?.[lang],
      city: destination.city?.[lang],
      description: destination.description?.[lang],
      name: destination.name?.[lang],
      slideCard: destination.slideCard?.map((sc) => ({
        ...sc,
        title: sc.title?.[lang],
        additionalDescription: sc.additionalDescription?.[lang],
        text: sc.text?.[lang],
        region: sc.region?.[lang],
        city: sc.city?.[lang],
        name: sc.name?.[lang],
      })),
      blogs: destination.blogs?.map((blog) => ({
        ...blog,
        title: blog.title?.[lang],
        blogText: blog.blogText?.[lang],
        desc: blog.desc?.[lang],
      })),
    };
  }
}
