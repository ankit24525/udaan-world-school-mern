import { Router } from "express";
import { createEnquiry, listEnquiries, updateEnquiryStatus, deleteEnquiry,} from "../controllers/enquiryController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/", requireAdmin, listEnquiries);
router.patch("/:id/status", requireAdmin, updateEnquiryStatus);
router.delete("/:id", requireAdmin, deleteEnquiry);


export default router;
