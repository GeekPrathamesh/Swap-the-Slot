import express from "express";
import Event from "../models/Event.js";
import SwapRequest from "../models/SwapRequest.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";
const router = express.Router();

// Get swappable slots (others)
router.get("/swappable-slots", auth, async (req, res) => {
  try {
    // Check if user exists (from auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized access — invalid user" });
    }

    // Fetch all swappable slots not owned by the current user
    const slots = await Event.find({
      owner: { $ne: req.user._id },
      status: "SWAPPABLE",
    }).populate("owner", "name");

    // Return slots list
    res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching swappable slots:", error.message);
    res.status(500).json({ error: "Server error while fetching swappable slots" });
  }
});


// Request swap
router.post("/swap-request", auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ error: "Missing slot IDs" });
    }

    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId),
      Event.findById(theirSlotId),
    ]);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ error: "Slot not found" });

    // Create the swap request
    const swap = await SwapRequest.create({
      mySlot: mySlotId,
      theirSlot: theirSlotId,
      fromUser: req.user._id,
      toUser: theirSlot.owner,
    });

    // Update both slot statuses
    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";

    await Promise.all([mySlot.save(), theirSlot.save()]);

    res.status(201).json(swap);
  } catch (error) {
    console.error("Error in swap-request:", error);
    res.status(500).json({
      error: "Server error while creating swap request",
      details: error.message,
    });
  }
});


// Respond to swap

router.post("/swap-response/:id", auth, async (req, res) => {

  const { accept } = req.body;
  const sr = await SwapRequest.findById(req.params.id);
  const mySlot = await Event.findById(sr.mySlot);
  const theirSlot = await Event.findById(sr.theirSlot);
  if (!sr) return res.status(404).json({ error: "Not found" });
  if (String(sr.toUser) !== String(req.user._id)) return res.status(403).json({ error: "Not allowed" });

  if (!accept) {
    sr.status = "REJECTED";
    mySlot.status = theirSlot.status = "SWAPPABLE";
    await Promise.all([sr.save(), mySlot.save(), theirSlot.save()]);
    return res.json({ msg: "Rejected" });

  }

  // Accept: swap owners
  const tmp = mySlot.owner;
  mySlot.owner = theirSlot.owner;
  theirSlot.owner = tmp;
  sr.status = "ACCEPTED";
  mySlot.status = theirSlot.status = "BUSY";
  await Promise.all([sr.save(), mySlot.save(), theirSlot.save()]);
  res.json({ msg: "Accepted" });
});

// Get all incoming swap requests (requests sent TO the logged-in user)
// Get all incoming swap requests (requests sent TO logged-in user)
router.get("/incoming", auth, async (req, res) => {
  try {
    const incomingRequests = await SwapRequest.find({ toUser: req.user._id })
      .populate({
        path: "mySlot",
        model: "Event",
        select: "title startTime endTime status",
      })
      .populate({
        path: "theirSlot",
        model: "Event",
        select: "title startTime endTime status",
      })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")  // ✅ add this
      .sort({ createdAt: -1 });

    res.status(200).json(incomingRequests);
  } catch (error) {
    console.error("Error fetching incoming swap requests:", error.message);
    res.status(500).json({ error: "Server error while fetching incoming requests" });
  }
});



// Get all outgoing swap requests (requests sent BY the logged-in user)
router.get("/outgoing", auth, async (req, res) => {
  try {
    const outgoingRequests = await SwapRequest.find({ fromUser: req.user._id })
      .populate({
        path: "mySlot",
        model: "Event",
        select: "title startTime endTime status",
      })
      .populate({
        path: "theirSlot",
        model: "Event",
        select: "title startTime endTime status",
      })
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error fetching outgoing swap requests:", error.message);
    res.status(500).json({ error: "Server error while fetching outgoing requests" });
  }
});



export default router;
