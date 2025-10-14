// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// interface LangText {
//   ka: string;
//   en: string;
// }

// @Entity('slider')
// export class Slider {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 500 })
//   src: string;

//   @Column({ type: 'jsonb' })
//   title: LangText;

//   @Column({ type: 'jsonb' })
//   description: LangText;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Slider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column('jsonb')
  title: { en: string; ka: string };

  @Column('jsonb')
  description: { en: string; ka: string };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
