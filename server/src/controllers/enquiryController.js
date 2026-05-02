import Enquiry from "../models/Enquiry.js";

export async function createEnquiry(req, res) {
  try {
    const count = await Enquiry.countDocuments();
    const prefix = req.body?.type === "career" ? "CAR" : "APP";

    const payload = {
      ...req.body,
      applicationId: `${prefix}${String(count + 1).padStart(3, "0")}`,
    };

    if (payload.type === "career") {
      payload.fullName = payload.fullName || payload.studentName || "";
      payload.studentName = payload.studentName || payload.fullName || "";
      payload.message = payload.message || payload.coverLetter || "";
      payload.status = payload.status || "new";
    }

    const enquiry = await Enquiry.create(payload);

    res.status(201).json({
      message: "Enquiry submitted",
      enquiry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function listEnquiries(req, res) {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function updateEnquiryStatus(req, res) {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function deleteEnquiry(req, res) {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Enquiry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
}
