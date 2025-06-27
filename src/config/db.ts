import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../../drizzle/schema'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in env')
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

pool
  .connect()
  .then((client) => {
    console.log('Connected to PostgreSQL')
    client.release()
  })
  .catch((err) => console.error('Error connecting to database', err))

export default pool

export const db = drizzle(pool, { schema })
