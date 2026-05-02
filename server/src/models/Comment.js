import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
    name: String,
    email: String,
    message: String,

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // 🔥 main comment vs reply
    },
userId: String,
   likes: {
  type: Number,
  default: 0,
},

likedBy: [
  {
    type: String, // store userId (from frontend)
  },
],
  },
  { timestamps: true }
);
export default mongoose.model("Comment", commentSchema);