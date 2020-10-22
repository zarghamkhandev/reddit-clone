import { Upvote } from '../../entity/Upvote';
import { getConnection } from 'typeorm';
import { Post } from '../../entity/Post';
import { Resolvers } from '../../types/resolvers-types';

export const postResolver: Resolvers = {
  Post: {
    voteStatus: async (post, __, { req }) => {
      const { userId } = req.session;
      const postId = post.id;
      const upvote = await Upvote.findOne({ where: { postId, userId } });
      if (upvote) {
        return upvote.value;
      }

      return null;
    },
  },
  Query: {
    posts: async (_, { limit, cursor }) => {
      const realLimit = Math.min(50, limit);
      const realLimitPlusOne = realLimit + 1;
      const qb = getConnection()
        .getRepository(Post)
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.creator', 'creator')
        .orderBy('p.createdAt', 'DESC')
        .take(realLimitPlusOne);
      if (cursor) {
        qb.where('p."createdAt" < :cursor', { cursor });
      }

      const posts = await qb.getMany();
      const hasMore = posts.length === realLimitPlusOne;
      return { posts: posts.slice(0, realLimit), hasMore };
    },
    post: async (_, { id }) => {
      const post = await Post.findOneOrFail({
        where: { id },
        relations: ['creator'],
      });
      return post;
    },
  },
  Mutation: {
    vote: async (_, { postId, value }, { req }) => {
      const { userId } = req.session;

      const isupVote = value !== -1;
      const realValue = isupVote ? 1 : -1;
      const upVote = await Upvote.findOne({
        where: { userId: userId, postId: postId },
      });
      const post = await Post.findOneOrFail({ where: { id: postId } });
      if (upVote && upVote.value !== realValue) {
        upVote.value = realValue;
        await upVote.save();

        post.points = post.points + realValue;

        await post.save();
        console.log('hi');
        return upVote;
      } else if (upVote && upVote.value === realValue) {
        return null;
      }
      const newUpvote = Upvote.create({
        userId,
        postId,
        value: realValue,
      });
      await newUpvote.save();
      post.points = post.points + realValue;
      await post.save();
      return newUpvote;
    },
    createPost: async (_, { title, text }, { req }) => {
      if (!req.session.userId) {
        throw new Error('not authenticated');
      }

      const post = Post.create({ title, text, creatorId: req.session.userId });
      await post.save();
      return post;
    },
    updatePost: async (_, { id, title }) => {
      const post = await Post.findOne({ where: { id } });
      if (!post) {
        return null;
      }
      post.title = title;
      await post.save();
      return post;
    },
    deletePost: async (_, { id }) => {
      try {
        await Post.delete({ id });
      } catch {
        return false;
      }
      return true;
    },
  },
};
