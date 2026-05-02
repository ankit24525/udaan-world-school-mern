import Facility from "../models/Facility.js";

export async function getFacilities(req, res) {
  const data = await Facility.find().sort({ createdAt: -1 });
  res.json(data);
}

export async function createFacility(req, res) {
  try {
    const facility = await Facility.create(req.body);
    res.json(facility);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
}

export async function updateFacility(req, res) {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(facility);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
}

export async function deleteFacility(req, res) {
  await Facility.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
