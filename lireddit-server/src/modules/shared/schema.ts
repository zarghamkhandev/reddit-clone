import { gql } from 'apollo-server-express';

export const sharedTypeDefs = gql`
  scalar Date
  type UserResponse {
    errors: [Error]
    user: User
  }
  type Error {
    field: String!
    message: String!
  }
`;
