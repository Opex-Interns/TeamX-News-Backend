import { Router } from "express";
import { addSubscriber } from "../controllers/subscriberController.js";

const router = Router();

router.post("/", addSubscriber);

export default router;
