import 'graphql-import-node'
import fastify from 'fastify'
import {
  getGraphQLParameters,
  processRequest,
  Request,
  sendResult,
  shouldRenderGraphiQL,
  renderGraphiQL,
} from 'graphql-helix'
import { schema } from './schema'
import { contextFactory } from './context'
import cors from 'fastify-cors'

const main = async () => {
  const server = fastify()

  server.register(cors, {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, Content-Type, Accept, Authorization',
    credentials: true,
  })

  server.route({
    method: ['POST', 'GET'],
    url: '/graphql',
    handler: async (req, res) => {
      const request: Request = {
        headers: req.headers,
        method: req.method,
        query: req.query,
        body: req.body,
      }

      if (shouldRenderGraphiQL(request)) {
        res.header('Content-Type', 'text/html')
        res.send(renderGraphiQL({ endpoint: '/graphql' }))

        return
      }

      const { operationName, query, variables } = getGraphQLParameters(request)

      const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory: () => contextFactory(req),
        query,
        variables,
      })

      res.raw.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      res.raw.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, Accept, Authorization'
      )
      res.raw.setHeader('Access-Control-Allow-Credentials', 'false')
      res.raw.setHeader('Access-Control-Allow-Origin', '*')

      sendResult(result, res.raw)
    },
  })

  server.listen(8002, 'localhost', () => {
    console.log('http://localhost:8002/graphql')
  })
}

main()
