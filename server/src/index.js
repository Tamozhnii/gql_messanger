const { ApolloServer } = require('apollo-server-express')
const { DB_API } = require('./db_context')
const { sequelize } = require('./../models')

const typeDefs = require('./Schema/TypeDefs')
const resolvers = require('./Schema/Resolvers')

const express = require('express')
const IsEmail = require('isemail')

const app = express()

const store = sequelize.models

const context = async ({ req }) => {
  /**Достаем токен из header-а запроса */
  const auth = (req.headers && req.headers.authorization) || ''
  /**Преобразовываем токен в строку (обратно в email) */
  const email = Buffer.from(auth, 'base64').toString('ascii')
  /**Проверка валидности email */
  if (!IsEmail.validate(email)) return { user: null }
  /**Находим пользователя*/
  const user = await store.Users.findOne({ where: { email } })
  return { user: user ? { ...user.dataValues } : null }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => ({ dbAPI: new DB_API({ store }) }),
})

server
  .start()
  .then(() => {
    server.applyMiddleware({ app })
  })
  .then(() => {
    app.listen({ port: 3001 }, () => {
      console.log(`http://localhost:3001${server.graphqlPath}`)
    })
  })
