import { Request, Response, NextFunction } from 'express'
import { db } from '../config/db'
import { redis } from '../config/redis'
import { books } from '../../drizzle/schema'

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = 'book_review:books'

  try {
    const cached = await redis.get(cacheKey)

    if (cached) {
      // cache hit bhai yay
      const parsedData = JSON.parse(cached)
      res.json({ source: 'cache', books: parsedData })
      return
    }
    // setting key value pair of book review books and time for cache to 5 min
    const data = await db.select().from(books)
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 60 * 5)

    res.json({ source: 'db', books: data })
  } catch (error) {
    // bhai agar redis cache me nahi hoga fir bhi db se populate karna hai

    console.error('Redis error', error)
    try {
      const allBooks = await db.select().from(books)
      res.json({ source: 'db_no_cache', books: allBooks })
      return
    } catch (error) {}
    next(error)
  }
}

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author } = req.body

    if (!title || !author) {
      res.status(400).json({ message: 'Missing title or author' })
    }

    const result = await db.insert(books).values({ title, author }).returning()

    res.status(201).json(result[0])
  } catch (error) {
    next(error)
  }
}
