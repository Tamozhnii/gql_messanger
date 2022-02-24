import { PrismaClient, User } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { authenticateUser } from './auth'
import { pubSub } from './pubsub'

export type GraphQLContext = {
  prisma: PrismaClient
  currentUser: User | null
  pubSub: typeof pubSub
}

const prisma = new PrismaClient()

export const contextFactory = async (
  request: FastifyRequest
): Promise<GraphQLContext> => {
  return {
    prisma,
    currentUser: await authenticateUser(prisma, request),
    pubSub,
  }
}
