import {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter,
} from 'apollo-server';
import { Message, User, Reaction } from '../../models';
import { NEW_REACTION } from '../type';

export default {
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),

    message: async (parent) =>
      await Message.findByPK(parent.messageId),

    user: async (parent) =>
      await User.findByPK(parent.userId, {
        attributes: ['username', 'imageUrl', 'createdAt'],
      }),
  },

  Mutation: {
    reactToMessage: async (
      _,
      { uuid, content },
      { user, pubsub }
    ) => {
      const reactions = [
        '❤️',
        '😆',
        '😯',
        '😢',
        '😡',
        '👍',
        '👎',
      ];
      try {
        if (!reactions.includes(content))
          throw new UserInputError('Invalid Reaction');

        const username = user ? user.username : '';

        user = await User.findOne({ where: { username } });

        if (!user)
          throw new AuthenticationError('Unauthenticated');

        const message = await Message.findOne({
          where: { uuid },
        });

        if (!message)
          throw new UserInputError('message not found');

        if (
          message.from !== user.username &&
          message.to !== user.username
        ) {
          throw new ForbiddenError('Unauthorized');
        }

        let reaction = await Reaction.findOne({
          where: { messageId: message.id, userId: user.id },
        });

        if (reaction) {
          reaction.content = content;
          await reaction.save;
        } else {
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }
        pubsub.publish(NEW_REACTION, {
          newReaction: reaction,
        });
        return reaction;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user)
            throw new AuthenticationError(
              'Unauthenticated'
            );

          return pubsub.asyncIterator(NEW_REACTION);
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();
          if (
            message.from === user.username ||
            message.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
