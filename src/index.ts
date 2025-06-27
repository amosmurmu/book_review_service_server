import { Request, Response, NextFunction } from 'express'
import express from 'express'
import { db } from './config/db'
import bookRoutes from './routes/books.route'
import reviewRoutes from './routes/reviews.route'
import { setupSwagger } from './swagger'
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('hello world')
})

app.use(express.json())
setupSwagger(app)

app.use(bookRoutes)
app.use(reviewRoutes)

const testDbConnection = async () => {
  try {
    await db.execute('SELECT 1')
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed', error)
    process.exit(1)
  }
}

const startServer = async () => {
  await testDbConnection()
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
