import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { me } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authMiddleware, me)

export default router;