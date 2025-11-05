import express from "express";
import Event from "../models/Event.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create
router.post("/events", auth, async (req, res) => {
  const event = await Event.create({ ...req.body, owner: req.user._id });
  res.json(event);
});

// Get my events
router.get("/events", auth, async (req, res) => {
  const events = await Event.find({ owner: req.user._id });
  res.json(events);
});

// Update status
router.put("/events/:id", auth, async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  res.json(event);
});

// Delete
router.delete("/events/:id", auth, async (req, res) => {
  await Event.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  res.json({ success: true });
});

export default router;
