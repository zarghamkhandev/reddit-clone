import { Post } from '../../entity/Post';
import { Resolvers } from '../../types/resolvers-types';

export const postResolver: Resolvers = {
  Query: {
    posts: async () => {
      const posts = await Post.find();
      return posts;
    },
    post: async (_, { id }) => {
      const post = await Post.findOneOrFail({ where: { id } });
      return post;
    },
  },
  Mutation: {
    createPost: async (_, { title }) => {
      const post = Post.create({ title });
      await post.save();
      return post;
    },
    updatePost: async (_, { id, title }) => {
      const post = await Post.findOneOrFail({ where: { id } });
      if (!post) {
        return null;
      }
      post.title = title;
      await post.save();
      return post;
    },
  },
};
