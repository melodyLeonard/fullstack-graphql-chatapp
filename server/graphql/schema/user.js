import { gql } from "apollo-server";

export default gql`
  type User {
    id: ID!
    username: String!
    email: String
    createdAt: String!
    latestMessage: Message
    imageUrl: String
  }

  type Query {
    getUsers: [User]!
  }

  type registerResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type loginResponse {
    ok: Boolean!
    token: String
    user: User
    errors: [Error!]
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): registerResponse!

    login(email: String!, password: String!): loginResponse
  }
`;
