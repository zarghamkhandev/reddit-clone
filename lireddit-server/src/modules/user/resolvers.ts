import { Resolvers } from '../../types/resolvers-types';
import argon from 'argon2';
import { User } from '../../entity/User';

export const userResolver: Resolvers = {
  Mutation: {
    register: async (_, { options }) => {
      const { username, password } = options;
      if (username.length <= 2) {
        return {
          errors: [
            {
              field: 'username',
              message: 'length must be greater than 2',
            },
          ],
        };
      }
      if (password.length <= 3) {
        return {
          errors: [
            {
              field: 'password',
              message: 'length must be greater than 3',
            },
          ],
        };
      }

      const hashedPassword = await argon.hash(password);
      const findUser = await User.findOne({ where: { username } });
      if (findUser) {
        return {
          errors: [{ message: 'user already exists', field: 'username' }],
        };
      }
      const user = User.create({ username, password: hashedPassword });
      await user.save();
      return { user };
    },
    login: async (_, { options }) => {
      const { username, password } = options;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        const error = [
          {
            field: 'username',
            message: 'User does not exist',
          },
        ];
        return {
          error,
        };
      }
      const verify = await argon.verify(user.password, password);
      if (!verify) {
        return {
          errors: [
            {
              field: 'password',
              message: 'incorrect password',
            },
          ],
        };
      }
      return { user };
    },
  },
};
