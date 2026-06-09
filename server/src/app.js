import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classConfigRoutes from "./routes/classConfigRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import documentRequestRoutes from "./routes/documentRequestRoutes.js";

import { getUser } from "./middleware/getUser.js";

const app = express();


// ✅ Allowed origins (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://udaanworldschool.in",            // your frontend domain
  "https://www.udaanworldschool.in",        // optional
  process.env.CLIENT_URL                    // fallback (optional)
];

// ✅ CORS setup (robust)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));


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
app.use("/api/facilities", facilityRoutes);
app.use("/api/document-requests", documentRequestRoutes);


// ✅ Root route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Udaan World School API" });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});


// ❗ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// ❗ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

export default app;
