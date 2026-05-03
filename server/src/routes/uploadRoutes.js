import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

const documentExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".csv",
  ".txt",
]);

function isDocumentFile(file) {
  const extension = path.extname(file?.originalname || "").toLowerCase();
  const mimeType = String(file?.mimetype || "").toLowerCase();

  return (
    documentExtensions.has(extension) ||
    mimeType.includes("pdf") ||
    mimeType.includes("msword") ||
    mimeType.includes("officedocument") ||
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("powerpoint") ||
    mimeType.includes("text/")
  );
}

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

    const isDocument = isDocumentFile(req.file);
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: isDocument ? "raw" : "auto",
      folder: isDocument ? "udaan/documents" : "udaan/media",
      use_filename: true,
      unique_filename: true,
    });

    await fs.unlink(req.file.path).catch(() => {});

    res.json({
      url: result.secure_url,
      resourceType: result.resource_type,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
