import DataLoader from 'dataloader';
import { User } from '../entity/User';
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdtToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdtToUser[parseInt(u.id)] = u;
    });

    return userIds.map((userId) => userIdtToUser[userId]);
  });
