import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();
await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Udaan Admin";

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env");
}

const existing = await Admin.findOne({ email: email.toLowerCase() });
if (existing) {
  console.log("Admin already exists");
  process.exit(0);
}

await Admin.create({
  name,
  email: email.toLowerCase(),
  password: await bcrypt.hash(password, 10),
});

console.log("Admin created");
process.exit(0);
