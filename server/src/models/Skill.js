import mongoose from "mongoose";
const skillSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: "Other" },
  description: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  mode: { type: String, enum: ["Online", "In person", "Both"], default: "Both" },
  availability: { type: String, default: "Flexible" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Skill", skillSchema);
