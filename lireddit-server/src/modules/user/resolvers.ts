import { Resolvers } from '../../types/resolvers-types';
import argon from 'argon2';
import { User } from '../../entity/User';
import { COOKIE_NAME } from '../../constants';
import { validateRegister } from '../../utils/validateRegister';

export const userResolver: Resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      const user = await User.findOneOrFail({
        where: { id: req.session.userId },
      });
      return user;
    },
    users: async () => {
      const users = await User.find();
      return users;
    },
  },
  Mutation: {
    register: async (_, { options }) => {
      const { username, password, email } = options;
      const response = validateRegister(username, email, password);
      if (response) {
        return response;
      }
      const hashedPassword = await argon.hash(password);
      const findUser = await User.findOne({ where: { username } });
      if (findUser) {
        return {
          errors: [{ message: 'user already exists', field: 'username' }],
        };
      }
      const user = User.create({ username, password: hashedPassword, email });
      await user.save();
      return { user };
    },
    login: async (_, { usernameOrEmail, password }, { req }) => {
      const user = await User.findOne({
        where: usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      });
      if (!user) {
        const error = [
          {
            field: 'username',
            message: 'User does not exist',
          },
        ];
        return {
          errors: error,
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
      // save user id into cookie
      req.session.userId = user.id;
      return { user };
    },
    logout: async (_, __, { req, res }) => {
      return new Promise((response) => {
        req.session.destroy((err) => {
          res.clearCookie(COOKIE_NAME);
          if (err) {
            console.log(err);
            response(false);
            return;
          } else {
            response(true);
          }
        });
      });
    },
    forgotPassword: async (_, { email }) => {
      const user = await User.findOne({ where: { email } });
      console.log(user);
      return true;
    },
  },
};
