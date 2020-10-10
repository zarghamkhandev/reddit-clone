import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: '255', unique: true })
  username!: string;
  @Column({ type: 'text', unique: true })
  email!: string;
  @Column({ type: 'text' })
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
