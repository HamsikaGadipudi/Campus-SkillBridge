import { Router } from "express";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import auth from "../middleware/auth.js";
const router = Router();
router.post("/", auth, async (req, res) => {
  try {
    const { skillId, rating, comment } = req.body;
    const completed = await Booking.findOne({ skill: skillId, learner: req.user.id, status: "Completed" });
    if (!completed) return res.status(403).json({ message: "You can review after a completed session" });
    const review = await Review.create({ skill: skillId, reviewer: req.user.id, rating, comment });
    res.status(201).json(review);
  } catch (e) { res.status(400).json({ message: "Review could not be saved. You may have already reviewed this skill." }); }
});
router.get("/skill/:skillId", async (req, res) => {
  const reviews = await Review.find({ skill: req.params.skillId }).populate("reviewer", "name").sort({ createdAt: -1 });
  res.json(reviews);
});
export default router;
