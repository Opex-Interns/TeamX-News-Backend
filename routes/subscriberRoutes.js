import { Router } from "express";
import { addSubscriber } from "../controllers/subscriberController.js";

const router = Router();

/**
 * @swagger
 * /api/subscribers:
 *   post:
 *     summary: Subscribe with an email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Subscription successful
 *       400:
 *         description: Invalid or duplicate email
 */
router.post("/", addSubscriber);

export default router;
