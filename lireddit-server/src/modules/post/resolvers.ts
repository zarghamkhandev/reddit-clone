import { Upvote } from '../../entity/Upvote';
import { getConnection } from 'typeorm';
import { Post } from '../../entity/Post';
import { Resolvers } from '../../types/resolvers-types';

export const postResolver: Resolvers = {
  Post: {
    voteStatus: async (post, __, { req, upvoteLoader }) => {
      const { userId } = req.session;
      if (!userId) {
        return null;
      }
      const postId = post.id;
      const upvote = await upvoteLoader.load({ postId, userId });
      if (!upvote) {
        return null;
      }

      return upvote.value;
    },
    creator: async (post, _, { userLoader }) => {
      const user = userLoader.load(post.creatorId);
      if (!user) {
        return null;
      }
      return user;
    },
  },
  Query: {
    posts: async (_, { limit, cursor }) => {
      const realLimit = Math.min(50, limit);
      const realLimitPlusOne = realLimit + 1;
      const qb = getConnection()
        .getRepository(Post)
        .createQueryBuilder('p')
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
    updatePost: async (_, { id, title, text }, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      const post = await Post.findOne({
        where: { id, creatorId: req.session.userId },
      });
      if (!post) {
        throw new Error('not found');
      }
      post.title = title;
      post.text = text;
      await post.save();
      return post;
    },
    deletePost: async (_, { id }, { req }) => {
      if (!req.session.userId) {
        return false;
      }

      const response = await Post.delete({ id, creatorId: req.session.userId });
      if (response.affected === 0) {
        throw new Error('not found');
      }

      return true;
    },
  },
};
