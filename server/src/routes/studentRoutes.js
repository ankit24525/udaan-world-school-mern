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


// ✅ BULK DELETE
router.post("/bulk-delete", async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({ message: "No students selected" });
    }

    await Student.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Students deleted", deletedCount: ids.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const students = Array.isArray(req.body) ? req.body : [];

    if (!students.length) {
      return res.status(400).json({ message: "No students to import" });
    }

    const created = await Student.insertMany(students);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD STUDENT
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
export default router;