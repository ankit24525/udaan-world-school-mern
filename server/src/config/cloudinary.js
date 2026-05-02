import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME?.trim() || process.env.CLOUD_NAME?.trim();
const apiKey =
  process.env.CLOUDINARY_API_KEY?.trim() || process.env.CLOUD_API_KEY?.trim();
const apiSecret =
  process.env.CLOUDINARY_API_SECRET?.trim() || process.env.CLOUD_API_SECRET?.trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
