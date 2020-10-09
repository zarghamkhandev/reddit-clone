import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  extend type Query {
    me: User
    users: [User]
  }
  extend type Mutation {
    register(options: options!): UserResponse!
    login(usernameOrEmail: String!, password: String!): UserResponse!
    logout: Boolean!
    forgotPassword(email: String!): Boolean!
  }
  input options {
    username: String!
    email: String!
    password: String!
  }

  type User {
    id: ID!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    username: String!
  }
`;
