import {
  UserInputError,
  AuthenticationError,
  withFilter,
} from 'apollo-server';
import { isEmpty } from '../../helpers';
import { Message, User, Reaction } from '../../models';
import { Op } from 'sequelize';
import { NEW_MESSAGE } from '../type';

export default {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user)
          throw new AuthenticationError('Unauthenticated');

        const otherUser = await User.findOne({
          where: { username: from },
        });
        if (!otherUser)
          throw new UserInputError('User not found');

        const usernames = [
          user.username,
          otherUser.username,
        ];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [['createdAt', 'DESC']],
          // include: [{ model: Reaction, as: 'reactions' }],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (
      parent,
      { to, content },
      { user, pubsub }
    ) => {
      try {
        if (!user)
          throw new AuthenticationError('Unauthenticated');

        const recipient = await User.findOne({
          where: { username: to },
        });
        if (!recipient) {
          throw new UserInputError('User not found');
        } else if (recipient.username === user.username) {
          throw new UserInputError(
            'You cant message yourself'
          );
        }
        if (isEmpty(content)) {
          throw new UserInputError('Message is empty');
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        pubsub.publish(NEW_MESSAGE, {
          newMessage: message,
        });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user)
            throw new AuthenticationError(
              'Unauthenticated'
            );

          return pubsub.asyncIterator(NEW_MESSAGE);
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
