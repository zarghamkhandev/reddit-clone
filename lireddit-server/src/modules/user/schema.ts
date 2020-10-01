import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  extend type Mutation {
    register(options: options!): UserResponse!
    login(options: options!): UserResponse!
  }
  input options {
    username: String!
    password: String!
  }

  type User {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    username: String!
  }
`;
