import { Router, Request, Response } from "express";

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get("/", async (_req: Request, res: Response) => {
  const health = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || "development",
  };

  try {
    res.status(200).json(health);
  } catch (error) {
    health.message = "Error checking services";
    res.status(503).json(health);
  }
});

/**
 * Liveness probe - simple check if server is running
 * GET /health/live
 */
router.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({ status: "alive" });
});

export default router;

