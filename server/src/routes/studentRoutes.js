import { Router } from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";

const router = Router();

function normalizeStudentDocument(value = {}) {
  return {
    name: String(value?.name || "Document").trim(),
    size: String(value?.size || "").trim(),
    date: String(value?.date || new Date().toISOString().slice(0, 10)).trim(),
    type: String(value?.type || "Document").trim(),
    fileUrl: String(value?.fileUrl || "").trim(),
    requestId: String(value?.requestId || "").trim(),
    source: String(value?.source || "Admin Upload").trim(),
    publicId: String(value?.publicId || "").trim(),
    resourceType: String(value?.resourceType || "").trim(),
  };
}

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

function serializeStudent(student) {
  if (!student) return null;
  return {
    ...student,
    _id: String(student._id),
    documents: Array.isArray(student.documents)
      ? student.documents.map((document) => ({
          ...document,
          _id: document?._id ? String(document._id) : "",
        }))
      : [],
  };
}

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


// ✅ ADD STUDENT DOCUMENT
router.post("/:id/documents", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const document = normalizeStudentDocument(req.body);

    if (!document.fileUrl) {
      return res.status(400).json({ message: "Uploaded file URL is missing" });
    }

    const result = await Student.collection.findOneAndUpdate(
      { _id: toObjectId(req.params.id) },
      { $push: { documents: { _id: new mongoose.Types.ObjectId(), ...document } } },
      { returnDocument: "after" }
    );

    res.status(201).json(serializeStudent(result.value || result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE STUDENT DOCUMENT
router.delete("/:id/documents/:documentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const result = await Student.collection.findOneAndUpdate(
      { _id: toObjectId(req.params.id) },
      { $pull: { documents: { _id: toObjectId(req.params.documentId) } } },
      { returnDocument: "after" }
    );

    res.json(serializeStudent(result.value || result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    if (Array.isArray(req.body?.documents)) {
      const documents = req.body.documents.map((document) => ({
        _id: document?._id ? toObjectId(document._id) : new mongoose.Types.ObjectId(),
        ...normalizeStudentDocument(document),
      }));

      const result = await Student.collection.findOneAndUpdate(
        { _id: toObjectId(req.params.id) },
        { $set: { documents } },
        { returnDocument: "after" }
      );

      if (!result.value && !result?._id) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json(serializeStudent(result.value || result));
    }

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
    const student = await Student.collection.findOne({ _id: toObjectId(req.params.id) });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(serializeStudent(student));
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