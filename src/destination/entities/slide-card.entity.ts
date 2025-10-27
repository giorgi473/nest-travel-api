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
  OneToMany,
} from 'typeorm';
import { Destination } from './destination.entity';
import { SlideCardBlog } from './slide-card-blog.entity';

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

interface AnotherSection {
  name1?: LangText;
  description?: LangText;
  image?: string;
  name2?: LangText;
  description2?: LangText;
  description3?: LangText;
  name4?: LangText;
  name5?: LangText;
  description4?: LangText;
  description5?: LangText;
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

  @Column({ type: 'jsonb', nullable: true })
  anotherSection?: AnotherSection;

  @OneToMany(() => SlideCardBlog, (blog) => blog.slideCard, { cascade: true })
  blogs?: SlideCardBlog[];

  // Nested slideCards (children)
  @OneToMany(() => SlideCard, (slideCard) => slideCard.parentSlideCard, {
    cascade: true,
  })
  childSlideCards?: SlideCard[];

  // Parent slideCard (self-referencing)
  @ManyToOne(() => SlideCard, (slideCard) => slideCard.childSlideCards, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_slide_card_id' })
  parentSlideCard?: SlideCard;

  @Column('int', { name: 'parent_slide_card_id', nullable: true })
  parentSlideCardId?: number;

  @ManyToOne(() => Destination, (destination) => destination.slideCard, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'destination_id' })
  destination?: Destination;

  @Column('int', { name: 'destination_id', nullable: true })
  destinationId?: number;
}
