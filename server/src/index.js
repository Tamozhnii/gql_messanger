const { ApolloServer } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { createServer } = require('http')
const express = require('express')

const { validate } = require('isemail')

const { DB_API } = require('./db_context')
const { sequelize } = require('./../models')

const typeDefs = require('./Schema/TypeDefs')
const resolvers = require('./Schema/Resolvers')

const app = express()
const httpServer = createServer(app)

const store = sequelize.models

const context = async ({ req }) => {
  /**Достаем токен из header-а запроса */
  const auth = (req.headers && req.headers.authorization) || ''
  /**Преобразовываем токен в строку (обратно в email) */
  const email = Buffer.from(auth, 'base64').toString('ascii')
  /**Проверка валидности email */
  if (!validate(email)) return { user: null }
  /**Находим пользователя*/
  const user = await store.Users.findOne({ where: { email } })
  return { user: user ? { ...user.dataValues } : null }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context,
  dataSources: () => ({ dbAPI: new DB_API({ store }) }),
})

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    onConnect(connectionParams, webSocket, context) {
      console.log('Connected!')
    },
    onDisconnect(webSocket, context) {
      console.log('Disconnected!')
    },
  },
  {
    server: httpServer,
    path: '/graphql',
  }
)

const server = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close()
          },
        }
      },
    },
  ],
})

server
  .start()
  .then(() => {
    server.applyMiddleware({ app })
  })
  .then(() => {
    const PORT = 3001
    httpServer.listen(PORT, () => {
      console.log(`http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
