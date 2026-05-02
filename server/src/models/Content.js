import mongoose from "mongoose";

const mixed = mongoose.Schema.Types.Mixed;

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["blog", "gallery", "page", "event", "document", "result", "career", "staffMember"],
      required: true,
    },
    key: { type: String, trim: true },
    title: { type: String, required: true },
    eyebrow: String,
    slug: { type: String, trim: true },
    excerpt: String,
    body: String,
    imageUrl: String,
    fileUrl: String,
    videoUrl: String,
    category: String,
    location: String,
    eventDate: Date,
    highlights: [String],
    meta: mixed,
    published: { type: Boolean, default: true },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [String],
  },
  { timestamps: true },
);

contentSchema.index({ type: 1, slug: 1 });
contentSchema.index(
  { type: 1, key: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: "page",
      key: { $exists: true, $type: "string" },
    },
  },
);

export default mongoose.model("Content", contentSchema);
