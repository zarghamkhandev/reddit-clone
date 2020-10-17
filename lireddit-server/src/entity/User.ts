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
import { Upvote } from './Upvote';

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

  @OneToMany(() => Post, (post: Post) => post.creator)
  posts: Post[];

  @OneToMany(() => Upvote, (upvot: Upvote) => upvot.userId)
  upvotes: Upvote[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
