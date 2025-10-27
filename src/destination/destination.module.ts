import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';
import { Destination } from './entities/destination.entity';
import { SlideCard } from './entities/slide-card.entity';
import { Blog } from './entities/blog.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SlideCardBlog } from './entities/slide-card-blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destination, SlideCard, Blog, SlideCardBlog]),
    CloudinaryModule,
  ],
  controllers: [DestinationController],
  providers: [DestinationService],
  exports: [DestinationService],
})
export class DestinationModule {}
