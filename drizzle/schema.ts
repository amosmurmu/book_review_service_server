import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core'

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  summary: text('summary'),
})

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    bookId: integer('book_id').references(() => books.id),
    rating: integer('rating').notNull(),
    description: text('description'),
  },
  (reviews) => {
    return {
      bookIdIndex: index('book_id_index').on(reviews.bookId),
    }
  }
)
