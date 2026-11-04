import { Router } from "express";
import Booking from "../models/Booking.js";
import Skill from "../models/Skill.js";
import auth from "../middleware/auth.js";
const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    const { skillId, date, message } = req.body;
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    if (String(skill.owner) === req.user.id) return res.status(400).json({ message: "You cannot book your own skill" });
    const booking = await Booking.create({ skill: skill._id, learner: req.user.id, tutor: skill.owner, date, message });
    res.status(201).json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get("/mine", auth, async (req, res) => {
  const bookings = await Booking.find({ $or: [{ learner: req.user.id }, { tutor: req.user.id }] })
    .populate("skill", "title category").populate("learner", "name").populate("tutor", "name").sort({ createdAt: -1 });
  res.json(bookings);
});
router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  if (!["Accepted", "Rejected", "Completed"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const booking = await Booking.findOne({ _id: req.params.id, tutor: req.user.id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  booking.status = status;
  await booking.save();
  res.json(booking);
});
export default router;
