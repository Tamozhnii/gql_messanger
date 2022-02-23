import { ApolloServer } from 'apollo-server-express'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { createServer } from 'http'
import express from 'express'

import { validate } from 'isemail'

import DB_API from './db_context'
import db from './../models'

import typeDefs from './Schema/TypeDefs'
import resolvers from './Schema/Resolvers'

const app = express()
const httpServer = createServer(app)

const store = db.sequelize.models

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
  // ...context,
  // dataSources: () => ({ dbAPI: new DB_API({ store }) }),
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
  resolvers,
  context,
  dataSources: () => ({ dbAPI: new DB_API({ store }) }),
  plugins: [
    subscriptionServer.server({ httpServer }),
    // {
    //   async serverWillStart() {
    //     return {
    //       async drainServer() {
    //         subscriptionServer.close()
    //       },
    //     }
    //   },
    // },
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
