import { Router } from "express";
import Student from "../models/Student.js";

const router = Router();

// ✅ GET STUDENTS (WITH FILTER)
router.get("/", async (req, res) => {
  try {
    const { search = "", className, section } = req.query;

    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (className && className !== "All") {
      query.className = className;
    }

    if (section && section !== "All") {
      query.section = section;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD STUDENT
router.post("/", async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


// ✅ GET SINGLE STUDENT
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ DELETE
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
router.post("/bulk", async (req, res) => {
  try {
    const students = await Student.insertMany(req.body);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;