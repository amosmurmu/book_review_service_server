import express from 'express'
import { getReviews, addReview } from '../controllers/reviews.controller'

const router = express.Router()

/**
 * @openapi
 * /books/{id}/reviews:
 *    get:
 *      summary: Get all reviews for a book
 *      tags:
 *        - Reviews
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the book
 *      responses:
 *          200:
 *            description: List of all reviews for a book
 */
router.get('/books/:id/reviews', getReviews)

/**
 * @openapi
 * /books/{id}/reviews:
 *    post:
 *     summary: Create a review for a book
 *     tags:
 *        - Reviews
 *     parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - rating
 *              - comment
 *            properties:
 *              rating:
 *                type: real
 *                example: 4.5
 *              description:
 *                type: string
 *                example: "Amazing book"
 *     responses:
 *          201:
 *            description: Review Creation
 */
router.post('/books/:id/reviews', addReview)

export default router
