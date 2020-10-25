import DataLoader from 'dataloader';
import { Upvote } from '../entity/Upvote';

export const createUpvoteLoader = () => {
  return new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findByIds(keys as any);

      const upvoteIdstoUpvote: Record<string, Upvote> = {};
      upvotes.forEach((upvote) => {
        upvoteIdstoUpvote[`${upvote.userId}|${upvote.postId}`] = upvote;
      });

      return keys.map(
        (key) => upvoteIdstoUpvote[`${key.userId}|${key.postId}`]
      );
    }
  );
};
