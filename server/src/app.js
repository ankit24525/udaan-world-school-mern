import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cookieParser from "cookie-parser";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { getUser } from "./middleware/getUser.js";
import classConfigRoutes from "./routes/classConfigRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";


const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.use(cookieParser());
app.use(getUser);

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/classes", classConfigRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/facilities", facilityRoutes); // 🔥 NOW WORKS
app.use("/api/scholarships", scholarshipRoutes);
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Udaan World School API" });
});

// ❗ ALWAYS KEEP THIS LAST
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: "Server error" });
});

export default app;