import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Upvote } from './Upvote';
import { User } from './User';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', unique: true })
  title: string;
  @Column({ type: 'text' })
  text!: string;
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user: User) => user.posts)
  creator: User;

  @OneToMany(() => Upvote, (upvote: Upvote) => upvote.postId)
  upvotes: Upvote[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
