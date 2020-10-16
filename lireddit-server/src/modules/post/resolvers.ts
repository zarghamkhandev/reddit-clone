import { getConnection } from 'typeorm';
import { Post } from '../../entity/Post';
import { Resolvers } from '../../types/resolvers-types';

export const postResolver: Resolvers = {
  Query: {
    posts: async (_, { limit, cursor }) => {
      const realLimit = Math.min(50, limit);
      const qb = getConnection()
        .getRepository(Post)
        .createQueryBuilder('p')
        .orderBy('"createdAt"', 'DESC')
        .take(realLimit);
      if (cursor) {
        qb.where('"createdAt"<:cursor', { cursor });
      }

      return qb.getMany();
    },
    post: async (_, { id }) => {
      const post = await Post.findOneOrFail({ where: { id } });
      return post;
    },
  },
  Mutation: {
    createPost: async (_, { title, text }, { req }) => {
      if (!req.session.userId) {
        throw new Error('not authenticated');
      }
      console.log(req.session.userId);
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
