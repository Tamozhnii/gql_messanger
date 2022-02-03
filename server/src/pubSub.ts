/*Временный класс для работы Subscription, рекомендуется использовать иные готовые решения для public версий 
https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries */
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

pubsub.publish('MESSAGE_ADDED', {
  messageAdded: {
    user: {
      name: 'Ali Baba',
    },
    message: {
      text: 'hello',
      date: new Date(),
    },
  },
})

export default pubsub
