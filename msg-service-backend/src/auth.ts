import { PrismaClient, User } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { JwtPayload, verify } from 'jsonwebtoken'

export const KEY = 'key'

export const authenticateUser = async (
  prisma: PrismaClient,
  request: FastifyRequest
): Promise<User | null> => {
  if (request?.headers?.authorization) {
    const token = request.headers.authorization.split(' ')[1]

    const tokenPayload = verify(token, KEY) as JwtPayload

    const userId = tokenPayload.userId

    return await prisma.user.findUnique({ where: { id: userId } })
  }
  return null
}
