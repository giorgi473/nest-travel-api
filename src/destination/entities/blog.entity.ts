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

@Entity('blog')
export class Blog {
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

  @ManyToOne(() => Destination, (destination) => destination.blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column('int', { name: 'destination_id' })
  destinationId: number;
}
