import { gql } from 'apollo-server-express'

/**Создание схемы для GQL (определение типов) */
const typeDefs = gql`
  # Types
  type User {
    id: ID!
    email: String!
    name: String!
    token: String
    isActive: Boolean
  }

  type Message {
    id: ID!
    date: String!
    userId: ID!
    text: String!
    isMyMessage: Boolean
  }
  #-------------
  # Quries
  type Query {
    getAllUsers: [User]!
    getMessages: [Message]!
    signin(email: String): User
  }
  #-------------
  # Mutations
  type Mutation {
    login(email: String): User
    sendMessage(text: String!): [Message]
    editMessage(messageId: ID!, text: String!): [Message]
    removeMessage(messageId: ID!): [Message]
  }
  #-------------
  # Subscriptions
  #-------------
`
export default typeDefs
