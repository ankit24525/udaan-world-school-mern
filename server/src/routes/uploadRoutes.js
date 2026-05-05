import { Router } from "express";
import path from "path";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

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
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME?.trim() || process.env.CLOUD_NAME?.trim();
    const apiKey =
      process.env.CLOUDINARY_API_KEY?.trim() || process.env.CLOUD_API_KEY?.trim();
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET?.trim() || process.env.CLOUD_API_SECRET?.trim();

    if (!cloudName) {
      return res
        .status(500)
        .json({ message: "Cloudinary cloud name is missing in server .env" });
    }

    if (!apiKey || !apiSecret) {
      return res
        .status(500)
        .json({ message: "Cloudinary API key or secret is missing in server .env" });
    }

    if (!req.file || !req.file.buffer?.length) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isDocument = isDocumentFile(req.file);
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: isDocument ? "raw" : "auto",
          folder: isDocument ? "udaan/documents" : "udaan/media",
          use_filename: true,
          unique_filename: true,
          filename_override: req.file.originalname,
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      resourceType: result.resource_type,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      message: error?.message || error?.error?.message || "Upload failed",
    });
  }
});

export default router;
