jest.mock('../../config/db', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => [
        { id: 1, title: 'Mock Book', author: 'Mock Author' },
      ]),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(() => [
          { id: 2, title: 'Integration Book', author: 'Integration Author' },
        ]),
      })),
    })),
  },
}))

jest.mock('../../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

import request from 'supertest'
import app from '../../index'

describe('Books API - Integration', () => {
  describe('GET /api/books', () => {
    it('should return an array of books', async () => {
      const response = await request(app).get('/api/books')

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body.books)).toBe(true)
    })

    it('should fetch from DB if cache is missing (cache-miss path) ', async () => {
      const redis = require('../../config/redis').redis
      redis.get.mockResolvedValue(null)

      const db = require('../../config/db').db
      const fakeBooks = [
        { id: 99, title: 'Cache Miss Book', author: 'DB Author' },
      ]
      db.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(fakeBooks),
      })

      const response = await request(app).get('/api/books')

      expect(response.statusCode).toBe(200)
      expect(response.body.source).toBe('db')
      expect(response.body.books).toEqual(fakeBooks)

      // Confirm caching happened
      expect(redis.set).toHaveBeenCalledWith(
        'book_review:books',
        JSON.stringify(fakeBooks),
        'EX',
        60 * 5
      )
    })
  })

  describe('POST /api/books', () => {
    it('should create a new book and return it', async () => {
      const newBook = {
        title: 'Integration Book',
        author: 'Integration Author',
      }

      const response = await request(app).post('/api/books').send(newBook)

      expect(response.statusCode).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe(newBook.title)
      expect(response.body.author).toBe(newBook.author)
    })

    it('should return 400 if title or author is missing', async () => {
      const response = await request(app).post('/api/books').send({})

      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('Missing title or author')
    })
  })
})
