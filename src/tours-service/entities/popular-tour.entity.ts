import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Card } from './card.entity';

@Entity('popular_tours')
export class PopularTour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: { ka: string; en: string };

  @Column('text')
  image: string;

  @Column('text', { nullable: true })
  mapLink: string;

  @Column('jsonb')
  description: { ka: string; en: string };

  @ManyToOne(() => Card, (card) => card.popularTours, { onDelete: 'CASCADE' })
  card: Card;
}
