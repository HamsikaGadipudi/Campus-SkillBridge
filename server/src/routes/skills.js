import { Router } from "express";
import Skill from "../models/Skill.js";
import auth from "../middleware/auth.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } }
    ];
    if (req.query.category) filter.category = req.query.category;
    const skills = await Skill.find(filter).populate("owner", "name department year").sort({ createdAt: -1 });
    res.json(skills);
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.post("/", auth, async (req, res) => {
  try {
    const { title, category, description, level, mode, availability } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Title and description are required" });
    const skill = await Skill.create({ title, category, description, level, mode, availability, owner: req.user.id });
    res.status(201).json(skill);
  } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get("/:id", async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate("owner", "name department year bio");
  if (!skill) return res.status(404).json({ message: "Skill not found" });
  res.json(skill);
});
router.put("/:id", auth, async (req, res) => {
  const skill = await Skill.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true, runValidators: true });
  if (!skill) return res.status(404).json({ message: "Skill not found or not yours" });
  res.json(skill);
});
router.delete("/:id", auth, async (req, res) => {
  const skill = await Skill.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!skill) return res.status(404).json({ message: "Skill not found or not yours" });
  res.json({ message: "Skill deleted" });
});
export default router;
