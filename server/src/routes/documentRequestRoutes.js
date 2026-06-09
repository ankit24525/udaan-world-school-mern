import { Router } from "express";
import {
  createDocumentRequest,
  createDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  getStudentDocumentRequests,
  listDocumentRequests,
  updateDocumentRequest,
  updateDocumentType,
} from "../controllers/documentRequestController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/types", getDocumentTypes);
router.post("/request", createDocumentRequest);
router.get("/student", getStudentDocumentRequests);

router.get("/", requireAdmin, listDocumentRequests);
router.post("/types", requireAdmin, createDocumentType);
router.put("/types/:id", requireAdmin, updateDocumentType);
router.delete("/types/:id", requireAdmin, deleteDocumentType);
router.patch("/:id", requireAdmin, updateDocumentRequest);

export default router;
