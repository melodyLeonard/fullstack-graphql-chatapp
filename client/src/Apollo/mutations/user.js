import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      user {
        id
        createdAt
        email
        username
      }
      errors {
        path
        message
      }
    }
  }
`;
