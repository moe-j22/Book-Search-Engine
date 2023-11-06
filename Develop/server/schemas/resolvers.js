const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    createUser: async (_, { body }, res) => {
      const user = await User.create(body);

      if (!user) {
        throw new AuthenticationError('Something went wrong');
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { body }, res) => {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password');
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
