import { Router } from "express";
import {
  createContent,
  deleteContent,
  downloadContentFile,
  getContent,
  listContent,
  updateContent,
  getContentById,
  getSingleContent
} from "../controllers/contentController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import Content from "../models/Content.js";
const router = Router();

router.get("/", listContent);
router.get("/download", downloadContentFile);

// 🔥 IMPORTANT: put this BEFORE slug
router.get("/id/:id", getContentById);

router.get("/:slug", getContent);

router.post("/", requireAdmin, createContent);
router.put("/:id", requireAdmin, updateContent);
router.delete("/:id", requireAdmin, deleteContent);
router.get("/:id", getSingleContent);
router.post("/like/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const blog = await Content.findById(req.params.id);

  const user = req.user.email;

  if (blog.likedBy?.includes(user)) {
    return res.json(blog);
  }

  blog.likes = (blog.likes || 0) + 1;
  blog.likedBy = [...(blog.likedBy || []), user];

  await blog.save();

  res.json(blog);
});
export default router;
