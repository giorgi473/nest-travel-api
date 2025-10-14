import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface LangText {
  ka: string;
  en: string;
}

@Entity('slider')
export class Slider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' }) // Changed from varchar(500) to text for base64
  src: string;

  @Column({ type: 'jsonb' })
  title: LangText;

  @Column({ type: 'jsonb' })
  description: LangText;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
