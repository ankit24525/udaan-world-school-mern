import { Router } from "express";
import {
  getScholarships,
  createScholarship,
  deleteScholarship,
  updateScholarship
} from "../controllers/scholarshipController.js";

const router = Router();

router.get("/", getScholarships);
router.post("/", createScholarship);
router.delete("/:id", deleteScholarship);
router.put("/:id", updateScholarship);
export default router;