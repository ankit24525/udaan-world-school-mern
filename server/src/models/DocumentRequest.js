import mongoose from "mongoose";

const documentTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const documentRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentName: String,
    registrationNo: { type: String, trim: true },
    dob: String,
    className: String,
    documentType: { type: String, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    fileUrl: String,
    fileName: String,
    publicId: String,
    resourceType: String,
    adminNotes: String,
    approvedAt: Date,
  },
  { timestamps: true }
);

export const DocumentType = mongoose.model("DocumentType", documentTypeSchema);
export default mongoose.model("DocumentRequest", documentRequestSchema);
