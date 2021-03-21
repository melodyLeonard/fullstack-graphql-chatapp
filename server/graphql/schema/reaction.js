import { gql } from 'apollo-server';

export default gql`
  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    message: Message!
    user: User!
  }

  type Mutation {
    reactToMessage(
      uuid: String!
      content: String!
    ): Reaction!
  }

  type Subscription {
    newReaction: Reaction!
  }
`;
