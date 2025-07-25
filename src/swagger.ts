import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Review Service',
      version: '1.0.0',
      description: 'API documentation for book service',
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
