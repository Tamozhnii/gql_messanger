import { User, Message } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { TypedPubSub } from 'typed-graphql-subscriptions'

export type PubSubChannels = {
  newUser: [{ createdUser: User }]
  editUser: [{ changedUser: User }]
  newMessage: [{ createdMessage: Message }]
  removeMessage: [{ deletedMessage: Message }]
  editMessage: [{ changedMessage: Message }]
}

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub())
