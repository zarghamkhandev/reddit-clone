import { gql } from 'apollo-server-express';

export const postTypeDefs = gql`
  extend type Query {
    posts(limit: Int!, cursor: Date): PaginatedPosts!
    post(id: Int!): Post!
  }

  extend type Mutation {
    createPost(title: String!, text: String!): Post!
    updatePost(title: String!, id: Int!): Post
    deletePost(id: Int!): Boolean!
  }

  type PaginatedPosts {
    posts: [Post!]
    hasMore: Boolean!
  }

  type Post {
    id: Int!
    createdAt: Date
    updatedAt: Date
    title: String!
    text: String!
    creatorId: Int!
    points: Int!
    creator: User
  }
`;
