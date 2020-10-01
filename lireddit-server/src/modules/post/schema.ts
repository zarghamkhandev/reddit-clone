import { gql } from 'apollo-server-express';

export const postTypeDefs = gql`
  extend type Query {
    me: String
    posts: [Post!]
    post(id: Int!): Post!
  }
  type Post {
    id: Int!
    createdAt: Date
    updatedAt: Date
    title: String!
  }
  extend type Mutation {
    createPost(title: String!): Post!
    updatePost(title: String!, id: Int!): Post
  }
`;
