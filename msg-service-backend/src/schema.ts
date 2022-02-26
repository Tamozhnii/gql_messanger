import { KEY } from './auth'
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './schema.graphql'
import { GraphQLContext } from './context'
import { Message, User, Prisma } from '@prisma/client'
import { PubSubChannels } from './pubsub'

const resolvers = {
  User: {
    id: (parent: User) => parent.id,
    name: (parent: User) => parent.name,
    email: (parent: User) => parent.email,
    color: (parent: User) => parent.color,
    messages: (parent: User, _args: {}, context: GraphQLContext) =>
      context.prisma.user.findUnique({ where: { id: parent.id } }).messages(),
  },
  Message: {
    id: (parent: Message) => parent.id,
    createdAt: (parent: Message) => parent.cteatedAt,
    text: (parent: Message) => parent.text,
    postedBy: async (parent: Message, _args: {}, context: GraphQLContext) => {
      if (!parent.postedById) return null
      return context.prisma.message
        .findUnique({ where: { id: parent.id } })
        .postedBy()
    },
  },
  Query: {
    me: async (_parent: unknown, _args: {}, context: GraphQLContext) => {
      if (context.currentUser === null) throw new Error('Unauthenticated')
      return context.currentUser
    },
    users: async (_parent: unknown, _args: {}, context: GraphQLContext) => {
      if (context.currentUser === null) throw new Error('Unauthenticated')
      return context.prisma.user.findMany()
    },
    messages: async (
      _parent: unknown,
      args: { filter?: string; skip?: number; take?: number },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) throw new Error('Unauthenticated')

      const where = args.filter
        ? {
            OR: [{ text: { contains: args.filter } }],
          }
        : {}

      const messages = await context.prisma.message.findMany({
        where,
        skip: args.skip,
        take: args.take || 10,
        orderBy: { cteatedAt: Prisma.SortOrder.desc },
      })

      const total = await context.prisma.message.count({ where })
      const next = (args.skip || 0) + (args.take || 10)

      return {
        messages,
        total,
        next: next < total ? next : total,
      }
    },
  },
  Mutation: {
    signup: async (
      _parent: unknown,
      args: { name: string; email: string; password: string },
      context: GraphQLContext
    ) => {
      const password = await hash(args.password, 10)

      const user = await context.prisma.user.create({
        data: { ...args, password },
      })

      context.pubSub.publish('newUser', { createdUser: user })

      const token = sign({ userId: user.id }, KEY)

      return {
        token,
        user,
      }
    },
    login: async (
      _parent: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      })
      if (!user) throw new Error('No such user found')

      const valid = await compare(args.password, user.password)
      if (!valid) throw new Error('Invalid password')

      const token = sign({ userId: user.id }, KEY)

      return {
        token,
        user,
      }
    },
    changeProfile: async (
      _parent: unknown,
      args: { name?: string; color?: string },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated!')
      }

      const changedUser = await context.prisma.user.update({
        where: { id: context.currentUser.id },
        data: {
          name: args.name || context.currentUser.name,
          color: args.color || context.currentUser.color,
        },
      })

      context.pubSub.publish('editUser', { changedUser })

      return changedUser
    },
    addMessage: async (
      _parent: unknown,
      args: { text: string },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated!')
      }

      const newMessage = await context.prisma.message.create({
        data: {
          text: args.text,
          postedBy: { connect: { id: context.currentUser.id } },
        },
      })

      context.pubSub.publish('newMessage', { createdMessage: newMessage })

      return newMessage
    },
    removeMessage: async (
      parent: Message,
      args: { id: number },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated!')
      }

      const deletedMessage = await context.prisma.message.delete({
        where: { id: Number(args.id) },
        include: { postedBy: parent.postedById === context.currentUser.id },
      })

      context.pubSub.publish('removeMessage', { deletedMessage })

      return deletedMessage
    },
    editMessage: async (
      parent: Message,
      args: { id: number; text: string },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated!')
      }

      const changedMessage = await context.prisma.message.update({
        where: {
          id: Number(args.id),
        },
        data: { text: args.text },
        include: { postedBy: parent.postedById === context.currentUser.id },
      })

      context.pubSub.publish('editMessage', { changedMessage })

      return changedMessage
    },
  },
  Subscription: {
    newUser: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('newUser')
      },
      resolve: (payload: PubSubChannels['newUser'][0]) => payload.createdUser,
    },
    newMessage: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('newMessage')
      },
      resolve: (payload: PubSubChannels['newMessage'][0]) =>
        payload.createdMessage,
    },
    removeMessage: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('removeMessage')
      },
      resolve: (payload: PubSubChannels['removeMessage'][0]) =>
        payload.deletedMessage,
    },
    editMessage: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('editMessage')
      },
      resolve: (payload: PubSubChannels['editMessage'][0]) =>
        payload.changedMessage,
    },
    editUser: {
      subscribe: (_parent: unknown, _args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('editUser')
      },
      resolve: (payload: PubSubChannels['editUser'][0]) => payload.changedUser,
    },
  },
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
