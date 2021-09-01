import express from 'express'

import setupSwagger from './swagger'
import setupMiddlewares from './middlewares'
import setupApolloServer from './apollo-server'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'

const app = express()

setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
setupApolloServer(app)

export default app
