import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAdmin, getDashboard);

export default router;