// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Destination } from './destination.entity';

// interface LangText {
//   ka?: string;
//   en?: string;
// }

// interface WorkingHours {
//   Monday?: string;
//   Tuesday?: string;
//   Wednesday?: string;
//   Thursday?: string;
//   Friday?: string;
//   Saturday?: string;
//   Sunday?: string;
// }

// @Entity('slide_card')
// export class SlideCard {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'jsonb', nullable: true })
//   title?: LangText;

//   @Column({ type: 'varchar', length: 500, nullable: true })
//   src?: string;

//   @Column({ type: 'varchar', length: 500, nullable: true })
//   modalSrc?: string;

//   @Column({ type: 'jsonb', nullable: true })
//   additionalDescription?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   text?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   region?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   city?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   name?: LangText;

//   @Column({ type: 'varchar', length: 500, nullable: true })
//   address?: string;

//   @Column({ type: 'varchar', length: 50, nullable: true })
//   phone?: string;

//   @Column({ type: 'varchar', length: 500, nullable: true })
//   website?: string;

//   @Column({ type: 'jsonb', nullable: true })
//   workingHours?: WorkingHours;

//   @ManyToOne(() => Destination, (destination) => destination.slideCard, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'destination_id' })
//   destination: Destination;

//   @Column('int', { name: 'destination_id' })
//   destinationId: number;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Destination } from './destination.entity';

interface LangText {
  ka?: string;
  en?: string;
}

interface WorkingHours {
  Monday?: string;
  Tuesday?: string;
  Wednesday?: string;
  Thursday?: string;
  Friday?: string;
  Saturday?: string;
  Sunday?: string;
}

@Entity('slide_card')
export class SlideCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  title?: LangText;

  @Column({ type: 'varchar', length: 500, nullable: true })
  src?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  modalSrc?: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalDescription?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  text?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  region?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  city?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  name?: LangText;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website?: string;

  @Column({ type: 'jsonb', nullable: true })
  workingHours?: WorkingHours;

  @ManyToOne(() => Destination, (destination) => destination.slideCard, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column('int', { name: 'destination_id' })
  destinationId: number;
}
