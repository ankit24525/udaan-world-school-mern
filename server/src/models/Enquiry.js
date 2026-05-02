import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["admission", "contact", "career"],
      default: "admission",
    },

    studentName: String,
    parentName: String,
    className: String,

    fullName: String,
    appliedRole: String,
    department: String,
    qualification: String,
    experience: String,
    resumeUrl: String,
    coverLetter: String,
    jobId: String,

    email: String,
    phone: { type: String, required: true },

    message: String,

    applicationId: String,
    testDate: String,

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "closed",
        "under_review",
        "approved",
        "test_scheduled",
        "shortlisted",
        "interview_scheduled",
        "hired",
        "rejected",
      ],
      default: "under_review",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
