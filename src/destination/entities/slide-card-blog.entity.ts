import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SlideCard } from './slide-card.entity';

interface LangText {
  ka?: string;
  en?: string;
}

@Entity('slide_card_blog')
export class SlideCardBlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  img?: string;

  @Column({ type: 'jsonb', nullable: true })
  title?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  blogText?: LangText;

  @Column({ type: 'jsonb', nullable: true })
  desc?: LangText;

  @ManyToOne(() => SlideCard, (slideCard) => slideCard.blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'slide_card_id' })
  slideCard: SlideCard;

  @Column('int', { name: 'slide_card_id' })
  slideCardId: number;
}
