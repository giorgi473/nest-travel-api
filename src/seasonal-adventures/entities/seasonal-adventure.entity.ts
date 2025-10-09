import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface LangText {
  ka?: string;
  en?: string;
}

@Entity('seasonal_adventure')
export class SeasonalAdventure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'jsonb' })
  title: LangText;

  @Column({ type: 'jsonb' })
  description: LangText;

  @Column({ type: 'jsonb' })
  header: LangText;

  @Column({ type: 'jsonb', name: 'header_description' })
  headerDescription: LangText;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
