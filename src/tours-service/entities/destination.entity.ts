import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ToursServiceEntity } from './tours-service.entity';

@Entity('destinations')
export class DestinationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: { ka: string; en: string };

  @Column('jsonb')
  description: { ka: string; en: string };

  @Column()
  image: string;

  @Column('jsonb')
  duration: { ka: string; en: string };

  @Column('jsonb')
  activities: { ka: string; en: string };

  @Column('jsonb')
  currency: { ka: string; en: string };

  @ManyToOne(() => ToursServiceEntity, (tour) => tour.destinations, {
    onDelete: 'CASCADE',
  })
  tour: ToursServiceEntity;
}
