jest.mock('../../config/db', () => ({
  db: {
    select: jest.fn(() => ({ from: jest.fn() })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({ returning: jest.fn() })),
    })),
  },
}))

jest.mock('../../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

import { getBooks, createBook } from '../../controllers/books.controller'
import { Request, Response } from 'express'
import { db } from '../../config/db'
import { redis } from '../../config/redis'

// GET endpoint bhai
describe('getBooks - unit', () => {
  const mockRes = () => {
    const res = {} as any
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  const req = {} as Request
  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns books from cache', async () => {
    const res = mockRes()
    const fakeBooks = [{ id: 1, title: 'Cached Book', author: 'Someone' }]
    ;(redis.get as jest.Mock).mockResolvedValue(JSON.stringify(fakeBooks))

    await getBooks(req, res, next)
    expect(redis.get).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({ source: 'cache', books: fakeBooks })
  })

  test('returns books from DB and caches it', async () => {
    const res = mockRes()
    ;(redis.get as jest.Mock).mockResolvedValue(null)
    ;(db.select as jest.Mock).mockReturnValue({
      from: jest
        .fn()
        .mockResolvedValue([{ id: 1, title: 'DB Book', author: 'A' }]),
    })

    await getBooks(req, res, next)

    expect(db.select).toHaveBeenCalled()
    expect(redis.set).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      source: 'db',
      books: [{ id: 1, title: 'DB Book', author: 'A' }],
    })
  })
})

// POST endpoint bhai
describe('createBook - unit', () => {
  const next = jest.fn()

  const mockRes = () => {
    const res = {} as any
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('creates a book and returns it', async () => {
    const req = {
      body: { title: 'New Book', author: 'Author' },
    } as Request

    const res = mockRes()

    ;(db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest
          .fn()
          .mockResolvedValue([{ id: 1, title: 'New Book', author: 'Author' }]),
      }),
    })

    await createBook(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      title: 'New Book',
      author: 'Author',
    })
  })

  test('returns 400 if missing fields', async () => {
    const req = { body: {} } as Request
    const res = mockRes()

    await createBook(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing title or author',
    })
  })
})
