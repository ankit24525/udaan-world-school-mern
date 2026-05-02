import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema({
  name: String,
  amount: String,
  criteria: String,
  seats: Number,
  awarded: Number,
});

export default mongoose.model("Scholarship", scholarshipSchema);