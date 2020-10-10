import { Resolvers } from '../../types/resolvers-types';
import argon from 'argon2';
import { User } from '../../entity/User';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../../constants';
import { validateRegister } from '../../utils/validateRegister';
import sendEmails from '../../utils/sendEmails';
import { v4 } from 'uuid';

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
            field: 'usernameOrEmail',
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
    forgotPassword: async (_, { email }, { redis }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // the email is not in database
        return true;
      }
      const token = v4();
      await redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        'ex',
        1000 * 60 * 60 * 24 * 3 // 3 days
      );
      await sendEmails(
        email,
        `<a href='http://localhost:3000/change-password/${token}'>Reset Password</a>`
      );
      return true;
    },
    changePassword: async (_, { token, newPassword }, { req, redis }) => {
      if (newPassword.length <= 3) {
        return {
          errors: [
            {
              field: 'newPassword',
              message: 'length mus be greater than 2',
            },
          ],
        };
      }

      const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
      if (!userId) {
        return {
          errors: [{ field: 'token', message: 'token expired' }],
        };
      }

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return {
          errors: [{ field: 'token', message: 'user no longer exists' }],
        };
      }

      const hashedPassword = await argon.hash(newPassword);

      user.password = hashedPassword;
      await user.save();
      redis.del(FORGET_PASSWORD_PREFIX + token);
      // login user after password change
      req.session.userId = user.id;
      return { user };
    },
  },
};
