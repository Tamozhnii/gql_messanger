import pubsub from './../pubSub'
/**Преобразователи GQL для запросов */
const resolvers = {
  Query: {
    getMessages: async (_, __, { dataSources }) => {
      const allMessages = await dataSources.dbAPI.getMessages()
      const me = dataSources.dbAPI.findOrCreateUser()
      const result = allMessages.map((message) => ({
        ...message,
        isMyMessage: message.userId === me.id,
      }))
      return result
    },
    getAllUsers: async (_, __, { dataSources }) => {
      const allUsers = await dataSources.dbAPI.getAllUsers()
      return allUsers
    },
    signin: async (_, { email }, { dataSources }) =>
      await dataSources.dbAPI.findUser({ email }),
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.dbAPI.findOrCreateUser({ email })
      if (user) {
        user.token = Buffer.from(email).toString('base64')
        return user
      }
    },
    sendMessage: async (_, { text }, { dataSources }) => {
      pubsub.publish('MESSAGE_ADDED', { messageAdded: text })
      // return postController.sendMessage(text)
    },
    editMessage: async (_, { messageId, text }, { dataSources }) => {},
    removeMessage: async (_, { messageId }, { dataSources }) => {},
  },
  // Subscription: {
  //   messageAdded: {
  //     // More on pubsub below
  //     subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED']),
  //   },
  // },
}

export default resolvers
