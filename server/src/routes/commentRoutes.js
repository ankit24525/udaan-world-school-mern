import { Router } from "express";
import Comment from "../models/Comment.js";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const comment = await Comment.create({
    ...req.body,
    userId: req.user.email,
  });

  res.json(comment);
});

// GET COMMENTS
router.get("/:blogId", async (req, res) => {
  const comments = await Comment.find({
    blogId: req.params.blogId,
  }).sort({ createdAt: -1 });

  res.json(comments);
});

// LIKE
router.post("/like/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }

  const comment = await Comment.findById(req.params.id); // ✅ FIXED

  const user = req.user.email;

  if (comment.likedBy.includes(user)) {
    return res.json(comment); // already liked
  }

  comment.likes += 1;
  comment.likedBy.push(user);

  await comment.save();

  res.json(comment);
});


// 🔥 ADD THESE HERE 👇

// DELETE COMMENT
router.delete("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.userId !== req.user.email) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await comment.deleteOne();
  res.json({ message: "Deleted" });
});

// EDIT COMMENT
router.put("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.userId !== req.user.email) {
    return res.status(403).json({ message: "Not allowed" });
  }

  comment.message = req.body.message;
  await comment.save();

  res.json(comment);
});


export default router;