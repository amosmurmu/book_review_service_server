import express from 'express'
import { Request, Response } from 'express'
import { getBooks, createBook } from '../controllers/books.controller'

const router = express.Router()

/**
 * @openapi
 * /books:
 *    get:
 *      summary: Get all books
 *      tags:
 *        - Books
 *      responses:
 *        200:
 *          description: List of all books
 */
router.get('/books', getBooks)

/**
 * @openapi
 * /books:
 *   post:
 *    summary: Create a book
 *    tags:
 *      - Books
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - author
 *            properties:
 *              title:
 *                type: string
 *                example: "The Hobbit"
 *              author:
 *                type: string
 *                example: "J.R.R. Tolkien"
 *    responses:
 *      201:
 *        description: Book creation
 *
 */
router.post('/books', createBook)

export default router
