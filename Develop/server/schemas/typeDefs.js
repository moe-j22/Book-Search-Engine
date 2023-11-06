const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    # Add other User fields as needed
  }

  type Auth {
    token: String
    user: User
  }

  input BookInput {
    bookId: ID
    title: String
    author: String
    description: String
    image: String
    link: String
    # Add other Book fields as needed
  }

  type Query {
    me: User
    # Add other query types here
  }

  type Mutation {
    createUser(body: UserInput!): Auth
    login(body: LoginInput!): Auth
    saveBook(body: BookInput!): User
    deleteBook(bookId: ID!): User
    # Add other mutation types here
  }

  input UserInput {
    username: String
    email: String
    password: String
    # Add other UserInput fields as needed
  }

  input LoginInput {
    username: String
    password: String
    # Add other LoginInput fields as needed
  }
`;

module.exports = typeDefs;
