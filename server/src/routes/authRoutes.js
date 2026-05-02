import { Router } from "express";
import jwt from "jsonwebtoken";
import { changePassword, login, logout, me } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

let otpStore = {};

router.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  console.log("OTP:", otp);
  res.json({ message: "OTP sent" });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const token = jwt.sign({ email }, "secret123", {
    expiresIn: "7d",
  });

  res.cookie("user", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login success" });
});

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);
router.post("/change-password", requireAdmin, changePassword);

export default router;
