import { Request, Response, NextFunction } from 'express'
import { db } from '../config/db'
import { books } from '../../drizzle/schema'

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBooks = await db.select().from(books)
    res.json(allBooks)
  } catch (error) {
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
