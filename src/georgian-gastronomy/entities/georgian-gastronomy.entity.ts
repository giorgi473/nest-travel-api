// entities/dish.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  href: string;

  @Column('json')
  header: {
    ka: string;
    en: string;
  };

  @Column('json', { nullable: true })
  title: {
    ka: string;
    en: string;
  };

  @Column('json', { nullable: true })
  text: {
    ka: string;
    en: string;
  };

  @Column('json', { nullable: true })
  description: {
    ka: string;
    en: string;
  };

  @Column({ default: 'Georgian Cuisine' })
  collectionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
