import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUsers {
    getUsers {
      id
      username
      createdAt
      imageUrl
      latestMessage {
        content
        from
        to
        uuid
      }
    }
  }
`;
