import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.route.js";

const router = Router();

// Mount routes
router.use("/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", usersRoutes);

export default router;

