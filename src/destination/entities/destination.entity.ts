// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   OneToMany,
// } from 'typeorm';
// import { SlideCard } from './slide-card.entity';
// import { Blog } from './blog.entity';

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

// interface AnotherSection {
//   name1?: LangText;
//   description?: LangText;
//   image?: string;
//   name2?: LangText;
//   description2?: LangText;
//   description3?: LangText;
//   name4?: LangText;
//   name5?: LangText;
//   description4?: LangText;
//   description5?: LangText;
// }

// @Entity('destination')
// export class Destination {
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
//   region?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   city?: LangText;

//   @Column({ type: 'jsonb', nullable: true })
//   description?: LangText;

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

//   @Column({ type: 'jsonb', nullable: true })
//   anotherSection?: AnotherSection;

//   @OneToMany(() => SlideCard, (slideCard) => slideCard.destination, {
//     cascade: true,
//   })
//   slideCard?: SlideCard[];

//   @OneToMany(() => Blog, (blog) => blog.destination, { cascade: true })
//   blogs?: Blog[];

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SlideCard } from './slide-card.entity';
import { Blog } from './blog.entity';

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

@Entity('destination')
export class Destination {
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
  region?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  city?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  description?: LangText;

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

  @OneToMany(() => SlideCard, (slideCard) => slideCard.destination, {
    cascade: true,
  })
  slideCard?: SlideCard[];

  @OneToMany(() => Blog, (blog) => blog.destination, { cascade: true })
  blogs?: Blog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
