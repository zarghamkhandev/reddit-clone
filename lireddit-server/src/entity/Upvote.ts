import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
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

  @ManyToMany(() => User, (user: User) => user.upvotes)
  user: User;

  @ManyToMany(() => Post, (post: Post) => post.upvotes)
  post: Post;
}
