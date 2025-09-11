//newRoutes
import { Router } from "express";
import { getNews } from "../controllers/newsController.js";

const router = Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get latest news headlines
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: A list of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   datetime:
 *                     type: integer
 *                   headline:
 *                     type: string
 *                   id:
 *                     type: integer
 *                   image:
 *                     type: string
 *                   source:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   url:
 *                     type: string
 */
router.get("/", getNews);

export default router;
