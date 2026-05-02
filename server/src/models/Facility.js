import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    count: Number,
    icon: String,
    image: String,
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("Facility", facilitySchema);
