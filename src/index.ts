import { Request, Response, NextFunction } from 'express'
import express from 'express'
import pool, { db } from './config/db'
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

app.use('/api', bookRoutes)
app.use('/api', reviewRoutes)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  })
})

export default app

const testDbConnection = async () => {
  try {
    await db.execute('SELECT 1')
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed', error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await pool.end()
  process.exit(1)
})

if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    await testDbConnection()
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
      console.log(`Api docs is /api-docs`)
    })
  }

  startServer().catch((err) => {
    console.error('Failed to start server', err)
    process.exit(1)
  })
}
