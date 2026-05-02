import { Router } from "express";
import fs from "fs/promises";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      !process.env.CLOUD_NAME?.trim()
    ) {
      return res
        .status(500)
        .json({ message: "Cloudinary cloud name is missing in server .env" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    await fs.unlink(req.file.path).catch(() => {});

    res.json({
      url: result.secure_url,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
