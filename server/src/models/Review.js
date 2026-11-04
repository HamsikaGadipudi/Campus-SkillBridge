import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" }
}, { timestamps: true });
reviewSchema.index({ skill: 1, reviewer: 1 }, { unique: true });
export default mongoose.model("Review", reviewSchema);
