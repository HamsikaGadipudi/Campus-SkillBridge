import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Completed"], default: "Pending" }
}, { timestamps: true });
export default mongoose.model("Booking", bookingSchema);
