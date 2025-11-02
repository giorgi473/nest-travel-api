import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PopularTour } from './popular-tour.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: { ka: string; en: string };

  @Column('text')
  image: string;

  @Column('jsonb')
  description: { ka: string; en: string };

  @Column('jsonb')
  duration: { ka: string; en: string };

  @Column('jsonb')
  activities: { ka: string; en: string };

  @Column('jsonb')
  currency: { ka: string; en: string };

  @OneToMany(() => PopularTour, (tour) => tour.card, { cascade: true })
  popularTours: PopularTour[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
