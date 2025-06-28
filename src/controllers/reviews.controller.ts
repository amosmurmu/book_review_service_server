import { reviews } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'
import { NextFunction, Request, Response } from 'express'
import { db } from '../../src/config/db'

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = parseInt(req.params.id)

    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookId, bookId))

    res.json({ bookId, reviews: result })
  } catch (err) {
    next(err)
  }
}

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = parseInt(req.params.id)
    if (isNaN(bookId)) {
      res.status(400).json({ error: 'Invalid book ID' })
    }
    const { rating, description } = req.body

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      res.status(400).json({ error: 'Rating must be a number between 0 and 5' })
    }

    const inserted = await db
      .insert(reviews)
      .values({
        bookId,
        rating,
        description,
      })
      .returning()

    res.status(201).json(inserted[0])
  } catch (error) {
    next(error)
  }
}
