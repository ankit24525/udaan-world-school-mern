import { Router } from "express";
import ClassConfig from "../models/ClassConfig.js";

const router = Router();

// ✅ GET ALL
router.get("/", async (req, res) => {
  const classes = await ClassConfig.find().sort({ name: 1 });
  res.json(classes);
});


router.get("/seed-default", async (req, res) => {
  try {
    const existing = await ClassConfig.countDocuments();

    if (existing > 0) {
      return res.json({ message: "Classes already exist" });
    }

    await ClassConfig.insertMany([
      { name: "Playgroup", sections: ["A"], isDefault: true },
      { name: "Nursery", sections: ["A"], isDefault: true },
      { name: "LKG", sections: ["A"], isDefault: true },
      { name: "UKG", sections: ["A"], isDefault: true },

      ...Array.from({ length: 12 }, (_, i) => ({
        name: `${i + 1}`,
        sections: ["A", "B"],
        isDefault: true,
      })),
    ]);

    res.json({ message: "✅ Default classes added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ ADD CLASS
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Class name required" });
    }

    const exists = await ClassConfig.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = await ClassConfig.create({
      name,
      sections: [],
      isDefault: false,
    });

    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD SECTION
router.put("/:id", async (req, res) => {
  try {
    const { section } = req.body;

    const updated = await ClassConfig.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { sections: section } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔒 DELETE (PROTECTED)
router.delete("/:id", async (req, res) => {
  try {
    const cls = await ClassConfig.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 🔥 BLOCK DEFAULT
    if (cls.isDefault === true) {
      return res.status(403).json({
        message: "Default classes cannot be deleted",
      });
    }

    await ClassConfig.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;