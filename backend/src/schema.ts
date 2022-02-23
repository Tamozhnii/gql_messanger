import { PubSubChannels } from './pubsub'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLContext } from './context'
import typeDefs from './schema.graphql'
import { Link, Prisma, User } from '@prisma/client'
import { APP_SECRET } from './auth'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const resolvers = {
  Query: {
    feed: async (
      _parent: unknown,
      args: {
        filter?: string
        skip?: number
        take?: number
        orderBy?: {
          description?: Prisma.SortOrder
          url?: Prisma.SortOrder
          createdAt?: Prisma.SortOrder
        }
      },
      context: GraphQLContext
    ) => {
      const where = args.filter
        ? {
            OR: [
              { description: { contains: args.filter } },
              { url: { contains: args.filter } },
            ],
          }
        : {}

      const props = {
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
      }

      const totalCount = await context.prisma.link.count(props)
      const links = await context.prisma.link.findMany(props)

      return {
        count: totalCount,
        links,
      }
    },
    me: async (_parent: unknown, _args: any, context: GraphQLContext) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated')
      }
      return context.currentUser
    },
  },
  Mutation: {
    post: async (
      _parent: unknown,
      args: { description: string; url: string },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error('Unauthenticated')
      }
      const newLink = await context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
          postedBy: { connect: { id: context.currentUser.id } },
        },
      })

      context.pubSub.publish('newLink', { createdLink: newLink })

      return newLink
    },
    signup: async (
      _parent: unknown,
      args: { email: string; password: string; name: string },
      context: GraphQLContext
    ) => {
      const password = await hash(args.password, 10)

      const user = await context.prisma.user.create({
        data: {
          ...args,
          password,
        },
      })

      const token = sign({ userId: user.id }, APP_SECRET)

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
      if (!user) {
        throw new Error('User not found')
      }
      const valid = await compare(args.password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }
      const token = sign({ userId: user.id }, APP_SECRET)

      return {
        token,
        user,
      }
    },
    vote: async (
      parent: unknown,
      args: { linkId: string },
      context: GraphQLContext
    ) => {
      if (!context.currentUser) {
        throw new Error('You must login in order to use upvote!')
      }

      const userId = context.currentUser.id

      const vote = await context.prisma.vote.findUnique({
        where: {
          linkId_userId: {
            linkId: Number(args.linkId),
            userId,
          },
        },
      })

      if (vote !== null) {
        throw new Error(`Already voted for link: ${args.linkId}`)
      }

      const newVote = await context.prisma.vote.create({
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: Number(args.linkId) } },
        },
      })

      context.pubSub.publish('newVote', { createdVote: newVote })

      return newVote
    },
  },
  Subscription: {
    newLink: {
      subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('newLink')
      },
      resolve: (payload: PubSubChannels['newLink'][0]) => {
        return payload.createdLink
      },
    },
    newVote: {
      subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator('newVote')
      },
      resolve: (payload: PubSubChannels['newVote'][0]) => {
        return payload.createdVote
      },
    },
  },
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
    postedBy: async (parent: Link, _args: any, context: GraphQLContext) => {
      if (!parent.postedById) {
        return null
      }
      return context.prisma.link
        .findUnique({ where: { id: parent.id } })
        .postedBy()
    },
    votes: (parent: Link, args: {}, context: GraphQLContext) => {
      return context.prisma.link
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .votes()
    },
  },
  User: {
    links: (parent: User, args: any, context: GraphQLContext) => {
      context.prisma.user.findUnique({ where: { id: parent.id } }).links()
    },
  },
  Vote: {
    link: (parent: User, args: {}, context: GraphQLContext) =>
      context.prisma.vote.findUnique({ where: { id: parent.id } }).link(),
    user: (parent: User, args: {}, context: GraphQLContext) =>
      context.prisma.vote.findUnique({ where: { id: parent.id } }).user(),
  },
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
