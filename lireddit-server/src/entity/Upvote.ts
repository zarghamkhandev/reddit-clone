import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity('upvotes')
export class Upvote extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @Column({ type: 'int' })
  value: number;

  @ManyToOne(() => User, (user: User) => user.upvotes)
  user: User;

  @ManyToOne(() => Post, (post: Post) => post.upvotes, { onDelete: 'CASCADE' })
  post: Post;
}
