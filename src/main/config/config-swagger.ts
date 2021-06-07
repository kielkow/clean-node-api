import { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { serve, setup } from 'swagger-ui-express'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}
