import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email || "").toLowerCase() });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json({
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role },
    });
}

export function logout(req, res) {
  res.clearCookie("token").json({ message: "Logged out" });
}

export async function me(req, res) {
  res.json({ admin: req.admin });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.json({ message: "Password updated successfully" });
}
