import { gql } from 'apollo-server-express';

export const postTypeDefs = gql`
  extend type Query {
    me: String
    posts: [Post!]
    post(id: String!): Post!
  }
  type Post {
    id: String!
    createdAt: Date
    updatedAt: Date
    title: String!
  }
  extend type Mutation {
    createPost(title: String!): Post!
  }
`;
