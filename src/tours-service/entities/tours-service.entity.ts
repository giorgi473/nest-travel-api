import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DestinationEntity } from './destination.entity';

@Entity('tours')
export class ToursServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  title: { ka: string; en: string };

  @Column()
  src: string;

  @Column('jsonb')
  additionalDescription: { ka: string; en: string };

  @Column('jsonb')
  region: { ka: string; en: string };

  @Column()
  city: string;

  @Column()
  link: string;

  @Column('jsonb')
  description: { ka: string; en: string };

  @Column('jsonb')
  name: { ka: string; en: string };

  @Column('jsonb')
  address: { ka: string; en: string };

  @Column()
  phone: string;

  @Column()
  website: string;

  @OneToMany(() => DestinationEntity, (destination) => destination.tour, {
    cascade: true,
    eager: true,
  })
  destinations: DestinationEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
