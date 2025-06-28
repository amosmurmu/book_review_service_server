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
  connectionTimeoutMillis: 5000,
  max: 10,
  idleTimeoutMillis: 10000,
})

pool
  .connect()
  .then((client) => {
    console.log('Connected to PostgreSQL')
    client.release()
  })
  .catch((err) => console.error('Error connecting to database', err))

// keep alive connection so supabase doesn't kill my connection after idle time
setInterval(async () => {
  try {
    await pool.query('SELECT 1')
  } catch (err) {
    console.error('Keep-alive failed:', err)
  }
}, 30000)

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err)
})

export default pool

export const db = drizzle(pool, { schema })
