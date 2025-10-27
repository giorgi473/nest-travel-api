// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Destination } from './entities/destination.entity';
// import { SlideCard } from './entities/slide-card.entity';
// import { Blog } from './entities/blog.entity';
// import { CreateDestinationDto } from './dto/create-destination.dto';
// import { UpdateDestinationDto } from './dto/update-destination.dto';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';

// @Injectable()
// export class DestinationService {
//   constructor(
//     @InjectRepository(Destination)
//     private destinationRepository: Repository<Destination>,
//     @InjectRepository(SlideCard)
//     private slideCardRepository: Repository<SlideCard>,
//     @InjectRepository(Blog)
//     private blogRepository: Repository<Blog>,
//     private cloudinaryService: CloudinaryService,
//   ) {}

//   private async uploadIfBase64(
//     field: string | undefined,
//   ): Promise<string | undefined> {
//     if (!field || field.startsWith('http')) return field;
//     if (field.startsWith('data:image/')) {
//       const { url } = await this.cloudinaryService.uploadImage(
//         field,
//         'destinations',
//       );
//       return url;
//     }
//     return field;
//   }

//   async create(
//     createDestinationDto: CreateDestinationDto,
//   ): Promise<Destination> {
//     // Upload main images
//     const src = await this.uploadIfBase64(createDestinationDto.src);
//     const modalSrc = await this.uploadIfBase64(createDestinationDto.modalSrc);

//     // anotherSection image
//     let anotherSection = createDestinationDto.anotherSection
//       ? { ...createDestinationDto.anotherSection }
//       : undefined;
//     if (anotherSection?.image) {
//       anotherSection.image = await this.uploadIfBase64(anotherSection.image);
//     }

//     // slideCard images
//     let slideCard = createDestinationDto.slideCard || [];
//     slideCard = await Promise.all(
//       slideCard.map(async (sc) => {
//         const updatedSc = { ...sc };
//         updatedSc.src = await this.uploadIfBase64(sc.src);
//         updatedSc.modalSrc = await this.uploadIfBase64(sc.modalSrc);
//         return updatedSc;
//       }),
//     );

//     // blogs images
//     let blogs = createDestinationDto.blogs || [];
//     blogs = await Promise.all(
//       blogs.map(async (b) => {
//         const updatedB = { ...b };
//         if (updatedB.img) {
//           updatedB.img = await this.uploadIfBase64(updatedB.img);
//         }
//         return updatedB;
//       }),
//     );

//     const destination = new Destination();
//     Object.assign(destination, {
//       title: createDestinationDto.title,
//       src,
//       modalSrc,
//       additionalDescription: createDestinationDto.additionalDescription,
//       region: createDestinationDto.region,
//       city: createDestinationDto.city,
//       description: createDestinationDto.description,
//       name: createDestinationDto.name,
//       address: createDestinationDto.address,
//       phone: createDestinationDto.phone,
//       website: createDestinationDto.website,
//       workingHours: createDestinationDto.workingHours,
//       anotherSection,
//     });

//     const savedDestination = await this.destinationRepository.save(destination);

//     // შენახვა slideCard-ების
//     if (slideCard && slideCard.length > 0) {
//       const slideCards = slideCard.map((sc) => {
//         const slideCardEntity = new SlideCard();
//         Object.assign(slideCardEntity, sc);
//         slideCardEntity.destinationId = savedDestination.id;
//         return slideCardEntity;
//       });
//       await this.slideCardRepository.save(slideCards);
//     }

//     // შენახვა blogs-ების
//     if (blogs && blogs.length > 0) {
//       const blogEntities = blogs.map((b) => {
//         const blog = new Blog();
//         Object.assign(blog, b);
//         blog.destinationId = savedDestination.id;
//         return blog;
//       });
//       await this.blogRepository.save(blogEntities);
//     }

//     return this.findOne(savedDestination.id);
//   }

//   async findAll(lang?: 'ka' | 'en'): Promise<Destination[]> {
//     const destinations = await this.destinationRepository.find({
//       relations: ['slideCard', 'blogs'],
//       order: { createdAt: 'DESC' },
//     });

//     if (lang) {
//       return destinations.map((dest) => this.transformToLanguage(dest, lang));
//     }

//     return destinations;
//   }

//   async findOne(id: number, lang?: 'ka' | 'en'): Promise<Destination> {
//     const destination = await this.destinationRepository.findOne({
//       where: { id },
//       relations: ['slideCard', 'blogs'],
//     });

//     if (!destination) {
//       throw new NotFoundException(`Destination with ID ${id} not found`);
//     }

//     if (lang) {
//       return this.transformToLanguage(destination, lang);
//     }

//     return destination;
//   }

//   async update(
//     id: number,
//     updateDestinationDto: UpdateDestinationDto,
//   ): Promise<Destination> {
//     const destination = await this.findOne(id);

//     // Upload images თუ base64 არის
//     const src = await this.uploadIfBase64(updateDestinationDto.src);
//     const modalSrc = await this.uploadIfBase64(updateDestinationDto.modalSrc);

//     // anotherSection-ის განახლება
//     let anotherSection = updateDestinationDto.anotherSection;
//     if (anotherSection?.image) {
//       const uploadedImage = await this.uploadIfBase64(anotherSection.image);
//       anotherSection = { ...anotherSection, image: uploadedImage };
//     }

//     // მთავარი destination-ის განახლება
//     Object.assign(destination, {
//       title: updateDestinationDto.title ?? destination.title,
//       src: src ?? destination.src,
//       modalSrc: modalSrc ?? destination.modalSrc,
//       additionalDescription:
//         updateDestinationDto.additionalDescription ??
//         destination.additionalDescription,
//       region: updateDestinationDto.region ?? destination.region,
//       city: updateDestinationDto.city ?? destination.city,
//       description: updateDestinationDto.description ?? destination.description,
//       name: updateDestinationDto.name ?? destination.name,
//       address: updateDestinationDto.address ?? destination.address,
//       phone: updateDestinationDto.phone ?? destination.phone,
//       website: updateDestinationDto.website ?? destination.website,
//       workingHours:
//         updateDestinationDto.workingHours ?? destination.workingHours,
//       anotherSection: anotherSection ?? destination.anotherSection,
//     });

//     await this.destinationRepository.save(destination);

//     // slideCard-ების განახლება
//     if (updateDestinationDto.slideCard !== undefined) {
//       // წაშლა ძველი slideCard-ების
//       await this.slideCardRepository.delete({ destinationId: id });

//       if (updateDestinationDto.slideCard.length > 0) {
//         // ახალი slideCard-ების შექმნა (სურათების ატვირთვით)
//         const slideCards = await Promise.all(
//           updateDestinationDto.slideCard.map(async (sc) => {
//             const slideCard = new SlideCard();
//             const uploadedSrc = await this.uploadIfBase64(sc.src);
//             const uploadedModalSrc = await this.uploadIfBase64(sc.modalSrc);

//             Object.assign(slideCard, {
//               ...sc,
//               src: uploadedSrc,
//               modalSrc: uploadedModalSrc,
//             });
//             slideCard.destinationId = id;
//             return slideCard;
//           }),
//         );
//         await this.slideCardRepository.save(slideCards);
//       }
//     }

//     // blogs-ების განახლება
//     if (updateDestinationDto.blogs !== undefined) {
//       // წაშლა ძველი blogs-ების
//       await this.blogRepository.delete({ destinationId: id });

//       if (updateDestinationDto.blogs.length > 0) {
//         // ახალი blogs-ების შექმნა (სურათების ატვირთვით)
//         const blogs = await Promise.all(
//           updateDestinationDto.blogs.map(async (b) => {
//             const blog = new Blog();
//             const uploadedImg = await this.uploadIfBase64(b.img);

//             Object.assign(blog, {
//               ...b,
//               img: uploadedImg,
//             });
//             blog.destinationId = id;
//             return blog;
//           }),
//         );
//         await this.blogRepository.save(blogs);
//       }
//     }

//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     const result = await this.destinationRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`Destination with ID ${id} not found`);
//     }
//   }

//   private transformToLanguage(destination: any, lang: 'ka' | 'en'): any {
//     return {
//       ...destination,
//       title: destination.title?.[lang],
//       additionalDescription: destination.additionalDescription?.[lang],
//       region: destination.region?.[lang],
//       city: destination.city?.[lang],
//       description: destination.description?.[lang],
//       name: destination.name?.[lang],
//       anotherSection: destination.anotherSection
//         ? {
//             ...destination.anotherSection,
//             name1: destination.anotherSection.name1?.[lang],
//             description: destination.anotherSection.description?.[lang],
//             name2: destination.anotherSection.name2?.[lang],
//             description2: destination.anotherSection.description2?.[lang],
//             description3: destination.anotherSection.description3?.[lang],
//             name4: destination.anotherSection.name4?.[lang],
//             name5: destination.anotherSection.name5?.[lang],
//             description4: destination.anotherSection.description4?.[lang],
//             description5: destination.anotherSection.description5?.[lang],
//           }
//         : undefined,
//       slideCard: destination.slideCard?.map((sc) => ({
//         ...sc,
//         title: sc.title?.[lang],
//         additionalDescription: sc.additionalDescription?.[lang],
//         text: sc.text?.[lang],
//         region: sc.region?.[lang],
//         city: sc.city?.[lang],
//         name: sc.name?.[lang],
//       })),
//       blogs: destination.blogs?.map((blog) => ({
//         ...blog,
//         title: blog.title?.[lang],
//         blogText: blog.blogText?.[lang],
//         desc: blog.desc?.[lang],
//       })),
//     };
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { SlideCard } from './entities/slide-card.entity';
import { Blog } from './entities/blog.entity';
import { SlideCardBlog } from './entities/slide-card-blog.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    @InjectRepository(SlideCard)
    private slideCardRepository: Repository<SlideCard>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(SlideCardBlog)
    private slideCardBlogRepository: Repository<SlideCardBlog>,
    private cloudinaryService: CloudinaryService,
  ) {}

  private async uploadIfBase64(
    field: string | undefined,
  ): Promise<string | undefined> {
    if (!field || field.startsWith('http')) return field;
    if (field.startsWith('data:image/')) {
      const { url } = await this.cloudinaryService.uploadImage(
        field,
        'destinations',
      );
      return url;
    }
    return field;
  }

  private async processSlideCardImages(sc: any): Promise<any> {
    const updatedSc = { ...sc };
    updatedSc.src = await this.uploadIfBase64(sc.src);
    updatedSc.modalSrc = await this.uploadIfBase64(sc.modalSrc);

    // anotherSection image
    if (updatedSc.anotherSection?.image) {
      updatedSc.anotherSection = {
        ...updatedSc.anotherSection,
        image: await this.uploadIfBase64(updatedSc.anotherSection.image),
      };
    }

    // blogs images
    if (updatedSc.blogs && updatedSc.blogs.length > 0) {
      updatedSc.blogs = await Promise.all(
        updatedSc.blogs.map(async (blog) => {
          const updatedBlog = { ...blog };
          if (updatedBlog.img) {
            updatedBlog.img = await this.uploadIfBase64(updatedBlog.img);
          }
          return updatedBlog;
        }),
      );
    }

    // Nested slideCards (recursive)
    if (updatedSc.slideCard && updatedSc.slideCard.length > 0) {
      updatedSc.slideCard = await Promise.all(
        updatedSc.slideCard.map((nestedSc) =>
          this.processSlideCardImages(nestedSc),
        ),
      );
    }

    return updatedSc;
  }

  private async saveSlideCardRecursive(
    scData: any,
    destinationId?: number,
    parentSlideCardId?: number,
  ): Promise<SlideCard> {
    const slideCard = new SlideCard();
    const { blogs: scBlogs, slideCard: nestedSlideCards, ...scFields } = scData;

    Object.assign(slideCard, scFields);
    if (destinationId) slideCard.destinationId = destinationId;
    if (parentSlideCardId) slideCard.parentSlideCardId = parentSlideCardId;

    const savedSlideCard = await this.slideCardRepository.save(slideCard);

    // Save blogs
    if (scBlogs && scBlogs.length > 0) {
      const slideCardBlogEntities = scBlogs.map((blog) => {
        const slideCardBlog = new SlideCardBlog();
        Object.assign(slideCardBlog, blog);
        slideCardBlog.slideCardId = savedSlideCard.id;
        return slideCardBlog;
      });
      await this.slideCardBlogRepository.save(slideCardBlogEntities);
    }

    // Save nested slideCards (recursive)
    if (nestedSlideCards && nestedSlideCards.length > 0) {
      for (const nestedSc of nestedSlideCards) {
        await this.saveSlideCardRecursive(
          nestedSc,
          undefined,
          savedSlideCard.id,
        );
      }
    }

    return savedSlideCard;
  }

  async create(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    // Upload main images
    const src = await this.uploadIfBase64(createDestinationDto.src);
    const modalSrc = await this.uploadIfBase64(createDestinationDto.modalSrc);

    // anotherSection image
    let anotherSection = createDestinationDto.anotherSection
      ? { ...createDestinationDto.anotherSection }
      : undefined;
    if (anotherSection?.image) {
      anotherSection.image = await this.uploadIfBase64(anotherSection.image);
    }

    // slideCard images (recursive processing)
    let slideCard = createDestinationDto.slideCard || [];
    slideCard = await Promise.all(
      slideCard.map((sc) => this.processSlideCardImages(sc)),
    );

    // blogs images
    let blogs = createDestinationDto.blogs || [];
    blogs = await Promise.all(
      blogs.map(async (b) => {
        const updatedB = { ...b };
        if (updatedB.img) {
          updatedB.img = await this.uploadIfBase64(updatedB.img);
        }
        return updatedB;
      }),
    );

    const destination = new Destination();
    Object.assign(destination, {
      title: createDestinationDto.title,
      src,
      modalSrc,
      additionalDescription: createDestinationDto.additionalDescription,
      region: createDestinationDto.region,
      city: createDestinationDto.city,
      description: createDestinationDto.description,
      name: createDestinationDto.name,
      address: createDestinationDto.address,
      phone: createDestinationDto.phone,
      website: createDestinationDto.website,
      workingHours: createDestinationDto.workingHours,
      anotherSection,
    });

    const savedDestination = await this.destinationRepository.save(destination);

    // Save slideCards (recursive)
    if (slideCard && slideCard.length > 0) {
      for (const sc of slideCard) {
        await this.saveSlideCardRecursive(sc, savedDestination.id);
      }
    }

    // Save blogs
    if (blogs && blogs.length > 0) {
      const blogEntities = blogs.map((b) => {
        const blog = new Blog();
        Object.assign(blog, b);
        blog.destinationId = savedDestination.id;
        return blog;
      });
      await this.blogRepository.save(blogEntities);
    }

    return this.findOne(savedDestination.id);
  }

  async findAll(lang?: 'ka' | 'en'): Promise<Destination[]> {
    const destinations = await this.destinationRepository.find({
      relations: [
        'slideCard',
        'slideCard.blogs',
        'slideCard.childSlideCards',
        'slideCard.childSlideCards.blogs',
        'slideCard.childSlideCards.childSlideCards',
        'blogs',
      ],
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
      relations: [
        'slideCard',
        'slideCard.blogs',
        'slideCard.childSlideCards',
        'slideCard.childSlideCards.blogs',
        'slideCard.childSlideCards.childSlideCards',
        'blogs',
      ],
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

    // Upload images
    const src = await this.uploadIfBase64(updateDestinationDto.src);
    const modalSrc = await this.uploadIfBase64(updateDestinationDto.modalSrc);

    // anotherSection
    let anotherSection = updateDestinationDto.anotherSection;
    if (anotherSection?.image) {
      const uploadedImage = await this.uploadIfBase64(anotherSection.image);
      anotherSection = { ...anotherSection, image: uploadedImage };
    }

    // Update destination
    Object.assign(destination, {
      title: updateDestinationDto.title ?? destination.title,
      src: src ?? destination.src,
      modalSrc: modalSrc ?? destination.modalSrc,
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
      anotherSection: anotherSection ?? destination.anotherSection,
    });

    await this.destinationRepository.save(destination);

    // Update slideCards
    if (updateDestinationDto.slideCard !== undefined) {
      // Delete old slideCards (cascade will delete nested ones)
      await this.slideCardRepository.delete({ destinationId: id });

      if (updateDestinationDto.slideCard.length > 0) {
        // Process images
        const processedSlideCards = await Promise.all(
          updateDestinationDto.slideCard.map((sc) =>
            this.processSlideCardImages(sc),
          ),
        );

        // Save new slideCards (recursive)
        for (const sc of processedSlideCards) {
          await this.saveSlideCardRecursive(sc, id);
        }
      }
    }

    // Update blogs
    if (updateDestinationDto.blogs !== undefined) {
      await this.blogRepository.delete({ destinationId: id });

      if (updateDestinationDto.blogs.length > 0) {
        const blogs = await Promise.all(
          updateDestinationDto.blogs.map(async (b) => {
            const blog = new Blog();
            const uploadedImg = await this.uploadIfBase64(b.img);

            Object.assign(blog, {
              ...b,
              img: uploadedImg,
            });
            blog.destinationId = id;
            return blog;
          }),
        );
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

  private transformSlideCard(sc: any, lang: 'ka' | 'en'): any {
    return {
      ...sc,
      title: sc.title?.[lang],
      additionalDescription: sc.additionalDescription?.[lang],
      text: sc.text?.[lang],
      region: sc.region?.[lang],
      city: sc.city?.[lang],
      name: sc.name?.[lang],
      anotherSection: sc.anotherSection
        ? {
            ...sc.anotherSection,
            name1: sc.anotherSection.name1?.[lang],
            description: sc.anotherSection.description?.[lang],
            name2: sc.anotherSection.name2?.[lang],
            description2: sc.anotherSection.description2?.[lang],
            description3: sc.anotherSection.description3?.[lang],
            name4: sc.anotherSection.name4?.[lang],
            name5: sc.anotherSection.name5?.[lang],
            description4: sc.anotherSection.description4?.[lang],
            description5: sc.anotherSection.description5?.[lang],
          }
        : undefined,
      blogs: sc.blogs?.map((blog) => ({
        ...blog,
        title: blog.title?.[lang],
        blogText: blog.blogText?.[lang],
        desc: blog.desc?.[lang],
      })),
      slideCard: sc.childSlideCards?.map((nestedSc) =>
        this.transformSlideCard(nestedSc, lang),
      ),
    };
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
      anotherSection: destination.anotherSection
        ? {
            ...destination.anotherSection,
            name1: destination.anotherSection.name1?.[lang],
            description: destination.anotherSection.description?.[lang],
            name2: destination.anotherSection.name2?.[lang],
            description2: destination.anotherSection.description2?.[lang],
            description3: destination.anotherSection.description3?.[lang],
            name4: destination.anotherSection.name4?.[lang],
            name5: destination.anotherSection.name5?.[lang],
            description4: destination.anotherSection.description4?.[lang],
            description5: destination.anotherSection.description5?.[lang],
          }
        : undefined,
      slideCard: destination.slideCard?.map((sc) =>
        this.transformSlideCard(sc, lang),
      ),
      blogs: destination.blogs?.map((blog) => ({
        ...blog,
        title: blog.title?.[lang],
        blogText: blog.blogText?.[lang],
        desc: blog.desc?.[lang],
      })),
    };
  }
}
