import express, { Express } from 'express'

import setupSwagger from '@/main/config/swagger'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupStaticFiles from '@/main/config/static-files'
import { setupApolloServer } from '@/main/graphql/apollo'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)

  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })

  return app
}
