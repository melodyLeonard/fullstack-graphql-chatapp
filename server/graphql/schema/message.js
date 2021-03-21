import { gql } from 'apollo-server';

export default gql`
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
    reactions: [Reaction]
  }

  type Query {
    getMessages(from: String!): [Message]!
  }

  type Mutation {
    sendMessage(to: String!, content: String!): Message!
  }

  type Subscription {
    newMessage: Message!
  }
`;
