import Scholarship from "../models/Scholarship.js";

export async function getScholarships(req, res) {
  const data = await Scholarship.find();
  res.json(data);
}

export async function createScholarship(req, res) {
  try {
    const item = await Scholarship.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
}

export async function deleteScholarship(req, res) {
  await Scholarship.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
export async function updateScholarship(req, res) {
  try {
    const updated = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
}